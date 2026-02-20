import { get as idbGet, set as idbSet } from "idb-keyval";
import { logger } from "src/utils/logger";
import { genid } from "src/utils/genid";

const WALLPAPER_CACHE_NAME = "local-files";
const WALLPAPER_CACHE_URL = "https://wallpaper.invalid/full";
const WALLPAPER_IDB_KEY = "userUploadedWallpaper";
const WALLPAPER_STORAGE_KEY = "userUploadedWallpaper";
const UPLOADED_WALLPAPER_FILES_KEY = "uploadedWallpaperFiles";
const UPLOADED_WALLPAPER_BASE64_KEY_PREFIX = "uploadedWallpaperBase64";

export const WALLPAPER_HINT_LOCAL_KEY = "wallpaper-first-paint-hint";

export type UploadedWallpaperImageOptions = {
  size: string;
  x: string;
  y: string;
};

export type UploadedWallpaperVideoOptions = {
  zoom: number;
  playbackRate: number;
  fade: number;
};

export type UploadedWallpaperFileMeta = {
  id: string;
  name: string;
  mimeType: string;
  createdAt: number;
  lastUsedAt: number;
  imageOptions: UploadedWallpaperImageOptions;
  videoOptions: UploadedWallpaperVideoOptions;
};

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

const getCacheKey = (id: string, size: "full" | "thumb") =>
  `https://wallpaper.invalid/files/${encodeURIComponent(id)}/${size}`;
const getBase64StorageKey = (id: string, size: "full" | "thumb") =>
  `${UPLOADED_WALLPAPER_BASE64_KEY_PREFIX}:${id}:${size}`;

const blobToDataUrl = async (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed converting blob to data URL"));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(blob);
  });

const dataUrlToBlob = async (dataUrl: string): Promise<Blob | undefined> => {
  try {
    const response = await fetch(dataUrl);
    return await response.blob();
  } catch (err) {
    logger.log("Error converting base64 wallpaper to blob", err);
    return undefined;
  }
};

const getBase64StoredFile = async (
  id: string,
  size: "full" | "thumb"
): Promise<Blob | undefined> => {
  const key = getBase64StorageKey(id, size);
  const data = await getStorageLocal<string>(key);

  if (typeof data !== "string" || data.length === 0) return undefined;

  return await dataUrlToBlob(data);
};

const setStorageLocalChecked = (key: string, value: unknown): Promise<boolean> =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        logger.log("Error writing to chrome.storage.local", runtimeError.message);
        resolve(false);
        return;
      }

      resolve(true);
    });
  });

const setBase64StoredFile = async ({
  id,
  size,
  file
}: {
  id: string;
  size: "full" | "thumb";
  file: Blob;
}): Promise<boolean> => {
  try {
    const dataUrl = await blobToDataUrl(file);
    return await setStorageLocalChecked(getBase64StorageKey(id, size), dataUrl);
  } catch (err) {
    logger.log("Error serializing wallpaper file to base64", err);
    return false;
  }
};

const deleteBase64StoredFile = async (id: string) => {
  await setStorageLocal(getBase64StorageKey(id, "full"), null);
  await setStorageLocal(getBase64StorageKey(id, "thumb"), null);
};

const getCachedFile = async (id: string, size: "full" | "thumb"): Promise<Blob | undefined> => {
  const cache = await getWallpaperCache();
  if (!cache) return await getBase64StoredFile(id, size);

  try {
    const response = await cache.match(getCacheKey(id, size));
    if (!response) return await getBase64StoredFile(id, size);

    const blob = await response.blob();
    // Backfill base64 storage for files that were uploaded before this feature.
    void setBase64StoredFile({ id, size, file: blob });
    return blob;
  } catch (err) {
    logger.log("Error reading wallpaper from CacheStorage", err);
    return await getBase64StoredFile(id, size);
  }
};

const setCachedFile = async ({
  id,
  size,
  file
}: {
  id: string;
  size: "full" | "thumb";
  file: Blob;
}): Promise<boolean> => {
  const storedAsBase64 = await setBase64StoredFile({ id, size, file });
  const cache = await getWallpaperCache();
  if (!cache) return storedAsBase64;

  try {
    const headers = new Headers();
    if (file.type) headers.set("content-type", file.type);
    await cache.put(getCacheKey(id, size), new Response(file, { headers }));
    return true;
  } catch (err) {
    logger.log("Error writing wallpaper to CacheStorage", err);
    return storedAsBase64;
  }
};

const deleteCachedFile = async (id: string) => {
  await deleteBase64StoredFile(id);

  const cache = await getWallpaperCache();
  if (!cache) return;

  try {
    await cache.delete(getCacheKey(id, "full"));
    await cache.delete(getCacheKey(id, "thumb"));
  } catch (err) {
    logger.log("Error deleting wallpaper from CacheStorage", err);
  }
};

const getUploadedFilesMeta = async (): Promise<UploadedWallpaperFileMeta[]> => {
  const data = await getStorageLocal<UploadedWallpaperFileMeta[]>(UPLOADED_WALLPAPER_FILES_KEY);

  if (!Array.isArray(data)) return [];

  return data
    .filter((item) => item && typeof item.id === "string")
    .map((item) => ({
      id: item.id,
      name: item.name ?? "wallpaper",
      mimeType: item.mimeType ?? "",
      createdAt: Number.isFinite(item.createdAt) ? item.createdAt : Date.now(),
      lastUsedAt: Number.isFinite(item.lastUsedAt) ? item.lastUsedAt : Date.now(),
      imageOptions: {
        size: item.imageOptions?.size ?? "cover",
        x: item.imageOptions?.x ?? "50%",
        y: item.imageOptions?.y ?? "50%"
      },
      videoOptions: {
        zoom: Number.isFinite(item.videoOptions?.zoom) ? item.videoOptions.zoom : 1,
        playbackRate: Number.isFinite(item.videoOptions?.playbackRate)
          ? item.videoOptions.playbackRate
          : 1,
        fade: Number.isFinite(item.videoOptions?.fade) ? item.videoOptions.fade : 4
      }
    }));
};

const setUploadedFilesMeta = async (files: UploadedWallpaperFileMeta[]) => {
  await setStorageLocal(UPLOADED_WALLPAPER_FILES_KEY, files);
};

const optimizeWallpaper = async (file: Blob): Promise<Blob> => {
  const isImage = file.type?.startsWith("image/");

  if (!isImage || file.type.includes("gif")) return file;

  try {
    const isLandscape = globalThis.screen?.orientation?.type === "landscape-primary";
    const long = isLandscape ? globalThis.screen.width : globalThis.screen.height;
    const short = isLandscape ? globalThis.screen.height : globalThis.screen.width;
    const density = Math.min(2, globalThis.devicePixelRatio || 1);
    const ratio = Math.min(1.8, long / short);
    const target = short * ratio * density;

    if (file.size < 300000) return file;

    return await compressAsBlob(file, { size: target, q: 0.82 });
  } catch (err) {
    logger.log("Error compressing wallpaper", err);
    return file;
  }
};

const createThumbnail = async (file: Blob): Promise<Blob> => {
  if (!file.type.startsWith("image/")) return file;

  try {
    return await compressAsBlob(file, {
      size: 360,
      q: 0.4
    });
  } catch (err) {
    logger.log("Error creating wallpaper thumbnail", err);
    return file;
  }
};

let didAttemptLegacyMigration = false;

const migrateLegacySingleWallpaperIfNeeded = async () => {
  if (didAttemptLegacyMigration) return;
  didAttemptLegacyMigration = true;

  const uploadedFilesValue = await getStorageLocal<unknown>(UPLOADED_WALLPAPER_FILES_KEY);
  if (Array.isArray(uploadedFilesValue)) return;

  const existing = await getUploadedFilesMeta();
  if (existing.length > 0) return;

  let legacyWallpaper: Blob | string | undefined;

  try {
    const cache = await getWallpaperCache();
    const response = cache ? await cache.match(WALLPAPER_CACHE_URL) : undefined;
    legacyWallpaper = response ? await response.blob() : undefined;
  } catch (err) {
    logger.log("Error reading legacy cached wallpaper", err);
  }

  if (!legacyWallpaper) {
    try {
      const legacyIdb = await idbGet<Blob | string | null>(WALLPAPER_IDB_KEY);
      if (legacyIdb) legacyWallpaper = legacyIdb;
    } catch (err) {
      logger.log("Error reading legacy wallpaper from IndexedDB", err);
    }
  }

  if (!legacyWallpaper) {
    const legacyStorage = await getStorageLocal<string>(WALLPAPER_STORAGE_KEY);
    if (typeof legacyStorage === "string") legacyWallpaper = legacyStorage;
  }

  if (!legacyWallpaper) return;

  let blob: Blob;
  if (typeof legacyWallpaper === "string") {
    try {
      const response = await fetch(legacyWallpaper);
      blob = await response.blob();
    } catch (err) {
      logger.log("Error converting legacy base64 wallpaper", err);
      return;
    }
  } else {
    blob = legacyWallpaper;
  }

  const id = `legacy-${genid()}`;
  const optimized = await optimizeWallpaper(blob);
  const thumb = await createThumbnail(optimized);

  await setCachedFile({ id, size: "full", file: optimized });
  await setCachedFile({ id, size: "thumb", file: thumb });

  const now = Date.now();
  const metadata: UploadedWallpaperFileMeta = {
    id,
    name: "legacy-wallpaper",
    mimeType: optimized.type,
    createdAt: now,
    lastUsedAt: now,
    imageOptions: {
      size: "cover",
      x: "50%",
      y: "50%"
    },
    videoOptions: {
      zoom: 1,
      playbackRate: 1,
      fade: 4
    }
  };

  await setUploadedFilesMeta([metadata]);
};

export const listUploadedWallpaperFiles = async (): Promise<UploadedWallpaperFileMeta[]> => {
  await migrateLegacySingleWallpaperIfNeeded();

  return await getUploadedFilesMeta();
};

export const addUploadedWallpaperFiles = async (files: FileList | File[]) => {
  await migrateLegacySingleWallpaperIfNeeded();

  const current = await getUploadedFilesMeta();
  const list = Array.from(files);

  for (const file of list) {
    const id = genid();
    const optimized = await optimizeWallpaper(file);
    const thumb = await createThumbnail(optimized);
    const now = Date.now();

    const metadata: UploadedWallpaperFileMeta = {
      id,
      name: file.name,
      mimeType: optimized.type,
      createdAt: now,
      lastUsedAt: now,
      imageOptions: {
        size: "cover",
        x: "50%",
        y: "50%"
      },
      videoOptions: {
        zoom: 1,
        playbackRate: 1,
        fade: 4
      }
    };

    await setCachedFile({ id, size: "full", file: optimized });
    await setCachedFile({ id, size: "thumb", file: thumb });

    current.push(metadata);
  }

  await setUploadedFilesMeta(current);

  return current;
};

export const getUploadedWallpaperFile = async (id: string): Promise<Blob | undefined> => {
  await migrateLegacySingleWallpaperIfNeeded();
  return await getCachedFile(id, "full");
};

export const getUploadedWallpaperThumbnail = async (id: string): Promise<Blob | undefined> => {
  await migrateLegacySingleWallpaperIfNeeded();
  return await getCachedFile(id, "thumb");
};

export const updateUploadedWallpaperFileOptions = async ({
  id,
  imageOptions,
  videoOptions
}: {
  id: string;
  imageOptions?: Partial<UploadedWallpaperImageOptions>;
  videoOptions?: Partial<UploadedWallpaperVideoOptions>;
}) => {
  const list = await getUploadedFilesMeta();
  const index = list.findIndex((file) => file.id === id);

  if (index < 0) return;

  const file = list[index];

  if (imageOptions) {
    file.imageOptions = {
      ...file.imageOptions,
      ...imageOptions
    };
  }

  if (videoOptions) {
    file.videoOptions = {
      ...file.videoOptions,
      ...videoOptions
    };
  }

  list[index] = file;
  await setUploadedFilesMeta(list);
};

export const markUploadedWallpaperFileUsed = async (id: string) => {
  const list = await getUploadedFilesMeta();
  const index = list.findIndex((file) => file.id === id);

  if (index < 0) return;

  const now = Date.now();
  list[index].lastUsedAt = now;

  const [active] = list.splice(index, 1);
  list.unshift(active);

  await setUploadedFilesMeta(list);
};

export const removeUploadedWallpaperFiles = async (ids: string[]) => {
  if (ids.length === 0) return;

  const idSet = new Set(ids);
  const list = await getUploadedFilesMeta();
  const next = list.filter((file) => !idSet.has(file.id));

  for (const id of ids) {
    await deleteCachedFile(id);
  }

  await setUploadedFilesMeta(next);
};

export const reorderUploadedWallpaperFiles = async (orderedIds: string[]) => {
  if (orderedIds.length === 0) return;

  const list = await getUploadedFilesMeta();
  if (list.length <= 1) return;

  const idToMeta = new Map(list.map((item) => [item.id, item]));
  const reordered: UploadedWallpaperFileMeta[] = [];

  orderedIds.forEach((id) => {
    const match = idToMeta.get(id);
    if (!match) return;
    reordered.push(match);
    idToMeta.delete(id);
  });

  reordered.push(...idToMeta.values());
  await setUploadedFilesMeta(reordered);
};

export const resetUploadedWallpaperFiles = async () => {
  const list = await getUploadedFilesMeta();

  for (const file of list) {
    await deleteCachedFile(file.id);
  }

  await setUploadedFilesMeta([]);

  try {
    const cache = await getWallpaperCache();
    await cache?.delete(WALLPAPER_CACHE_URL);
  } catch (err) {
    logger.log("Error clearing legacy cached wallpaper", err);
  }

  try {
    await idbSet(WALLPAPER_IDB_KEY, null);
  } catch (err) {
    logger.log("Error clearing wallpaper from IndexedDB", err);
  }

  await setStorageLocal(WALLPAPER_STORAGE_KEY, null);
};

// legacy helper exports retained for migration-time callers
export const getStoredWallpaperFile = async (): Promise<Blob | string | undefined> => {
  const files = await listUploadedWallpaperFiles();
  if (files.length === 0) return undefined;

  const blob = await getUploadedWallpaperFile(files[0].id);
  return blob;
};

export const saveUploadedWallpaperFile = async (file: Blob) => {
  const fileName = file instanceof File ? file.name : "wallpaper";
  await addUploadedWallpaperFiles([new File([file], fileName, { type: file.type })]);
};

export const resetUploadedWallpaperFile = async () => {
  await resetUploadedWallpaperFiles();
};
