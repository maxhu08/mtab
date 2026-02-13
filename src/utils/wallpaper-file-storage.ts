import { get as idbGet, set as idbSet } from "idb-keyval";
import { logger } from "src/utils/logger";

const WALLPAPER_CACHE_NAME = "local-files";
const WALLPAPER_CACHE_URL = "http://127.0.0.1:8888/userUploadedWallpaper/full";
const WALLPAPER_IDB_KEY = "userUploadedWallpaper";
const WALLPAPER_STORAGE_KEY = "userUploadedWallpaper";

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

export const saveUploadedWallpaperFile = async (file: Blob) => {
  const wroteToCache = await setCachedWallpaper(file);

  if (!wroteToCache) {
    try {
      await idbSet(WALLPAPER_IDB_KEY, file);
    } catch (err) {
      logger.log("Error writing wallpaper to IndexedDB fallback", err);
    }
  }

  try {
    const base64String = await fileToBase64(file);
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
