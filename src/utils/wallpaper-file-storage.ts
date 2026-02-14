import { get as idbGet, set as idbSet } from "idb-keyval";
import { logger } from "src/utils/logger";

const WALLPAPER_CACHE_NAME = "local-files";
// use an unroutable, RFC 6761 reserved TLD to avoid any real network collisions.
const WALLPAPER_CACHE_URL = "https://wallpaper.invalid/full";
const WALLPAPER_IDB_KEY = "userUploadedWallpaper";
const WALLPAPER_STORAGE_KEY = "userUploadedWallpaper";
export const WALLPAPER_HINT_LOCAL_KEY = "wallpaper-first-paint-hint";

type CompressOptions = {
  type?: "jpeg" | "png" | "webp";
  size?: number;
  q?: number;
  raw?: boolean;
  square?: boolean;
};

const canUseCacheStorage = () => typeof caches !== "undefined";

const getStorageLocal = <T>(key: string): Promise<T | undefined> =>
  new Promise((resolve) => {
    chrome.storage.local.get([key], (data) => {
      resolve(data[key] as T | undefined);
    });
  });

const setStorageLocal = (key: string, value: unknown): Promise<void> =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => resolve());
  });

const loadOnCanvas = async (url: string, options: CompressOptions): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  if (!ctx) throw new Error("Cannot get canvas context");

  await new Promise((resolve) => {
    img.onload = () => {
      const { size, square, raw } = options;

      if (raw || !size) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        img.remove();
        resolve(true);
        return;
      }

      const isLandscape = img.width > img.height;
      let sx = 0;
      let sy = 0;
      let sWidth = img.width;
      let sHeight = img.height;
      let dWidth = size;
      let dHeight = size;

      if (!square) {
        if (isLandscape) {
          dHeight = size;
          dWidth = (img.width / img.height) * size;
        } else {
          dWidth = size;
          dHeight = (img.height / img.width) * size;
        }
      } else {
        if (isLandscape) {
          sx = (img.width - img.height) / 2;
          sWidth = sHeight = img.height;
        } else {
          sy = (img.height - img.width) / 2;
          sWidth = sHeight = img.width;
        }
      }

      canvas.width = dWidth;
      canvas.height = dHeight;
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);

      img.remove();
      resolve(true);
    };

    img.src = url;
  });

  return canvas;
};

const compressAsBlob = async (elem: Blob | string, options: CompressOptions): Promise<Blob> => {
  const type = options.type ?? "jpeg";
  const q = options.q ?? 0.9;

  const src: string = typeof elem === "string" ? elem : URL.createObjectURL(elem);

  const canvas = await loadOnCanvas(src, options);
  const ctx = canvas.getContext("2d");
  const newBlob = await new Promise<Blob | null>((resolve) => {
    ctx?.canvas.toBlob((b) => resolve(b), `image/${type}`, q);
  });

  if (!newBlob) throw new Error("Failed to compress wallpaper");
  if (typeof elem !== "string") URL.revokeObjectURL(src);
  return newBlob;
};

const getWallpaperCache = async () => {
  if (!canUseCacheStorage()) return null;

  try {
    return await caches.open(WALLPAPER_CACHE_NAME);
  } catch (err) {
    logger.log("Error opening wallpaper cache", err);
    return null;
  }
};

const getCachedWallpaper = async (): Promise<Blob | undefined> => {
  const cache = await getWallpaperCache();
  if (!cache) return undefined;

  try {
    const response = await cache.match(WALLPAPER_CACHE_URL);
    if (!response) return undefined;
    return await response.blob();
  } catch (err) {
    logger.log("Error reading wallpaper from CacheStorage", err);
    return undefined;
  }
};

const setCachedWallpaper = async (file: Blob): Promise<boolean> => {
  const cache = await getWallpaperCache();
  if (!cache) return false;

  try {
    const headers = new Headers();
    if (file.type) headers.set("content-type", file.type);
    await cache.put(WALLPAPER_CACHE_URL, new Response(file, { headers }));
    return true;
  } catch (err) {
    logger.log("Error writing wallpaper to CacheStorage", err);
    return false;
  }
};

const deleteCachedWallpaper = async () => {
  const cache = await getWallpaperCache();
  if (!cache) return;

  try {
    await cache.delete(WALLPAPER_CACHE_URL);
  } catch (err) {
    logger.log("Error deleting wallpaper from CacheStorage", err);
  }
};

const fileToBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const getStoredWallpaperFile = async (): Promise<Blob | string | undefined> => {
  const cachedWallpaper = await getCachedWallpaper();
  if (cachedWallpaper) return cachedWallpaper;

  try {
    const legacyWallpaper = await idbGet<Blob | string | null>(WALLPAPER_IDB_KEY);
    if (legacyWallpaper instanceof Blob) {
      const wroteToCache = await setCachedWallpaper(legacyWallpaper);
      if (!wroteToCache) return legacyWallpaper;
      return legacyWallpaper;
    }
    if (typeof legacyWallpaper === "string") return legacyWallpaper;
  } catch (err) {
    logger.log("Error reading legacy wallpaper from IndexedDB", err);
  }

  const storageWallpaper = await getStorageLocal<string>(WALLPAPER_STORAGE_KEY);
  return typeof storageWallpaper === "string" ? storageWallpaper : undefined;
};

const optimizeWallpaper = async (file: Blob): Promise<Blob> => {
  const isImage = file.type?.startsWith("image/");

  // keep gifs and videos uncompressed
  if (!isImage || file.type.includes("gif")) return file;

  try {
    const objectUrl = URL.createObjectURL(file);

    const isLandscape = globalThis.screen?.orientation?.type === "landscape-primary";
    const long = isLandscape ? globalThis.screen.width : globalThis.screen.height;
    const short = isLandscape ? globalThis.screen.height : globalThis.screen.width;
    const density = Math.min(2, globalThis.devicePixelRatio || 1);
    const ratio = Math.min(1.8, long / short);
    const target = short * ratio * density;

    URL.revokeObjectURL(objectUrl);

    // leave small images untouched
    if (file.size < 300000) return file;

    return await compressAsBlob(file, { size: target, q: 0.82 });
  } catch (err) {
    logger.log("Error compressing wallpaper", err);
    return file;
  }
};

export const saveUploadedWallpaperFile = async (file: Blob) => {
  const optimized = await optimizeWallpaper(file);

  const wroteToCache = await setCachedWallpaper(optimized);

  if (!wroteToCache) {
    try {
      await idbSet(WALLPAPER_IDB_KEY, optimized);
    } catch (err) {
      logger.log("Error writing wallpaper to IndexedDB fallback", err);
    }
  }

  try {
    const base64String = await fileToBase64(optimized);
    await setStorageLocal(WALLPAPER_STORAGE_KEY, base64String);
  } catch (err) {
    logger.log("Error writing wallpaper base64 fallback", err);
  }
};

export const resetUploadedWallpaperFile = async () => {
  await deleteCachedWallpaper();

  try {
    await idbSet(WALLPAPER_IDB_KEY, null);
  } catch (err) {
    logger.log("Error clearing wallpaper from IndexedDB", err);
  }

  await setStorageLocal(WALLPAPER_STORAGE_KEY, null);
};
