import { logger } from "~/src/utils/logger";
import { genid } from "~/src/utils/genid";

const MIXED_WALLPAPER_ENTRIES_KEY = "mixedWallpaperEntries";
const MIXED_UPLOADED_WALLPAPER_FILES_KEY = "mixedUploadedWallpaperFiles";
const MIXED_UPLOADED_WALLPAPER_BASE64_KEY_PREFIX = "mixedUploadedWallpaperBase64";
const MIXED_WALLPAPER_CACHE_NAME = "mixed-local-files";

export type MixedWallpaperEntryKind = "url" | "solid-color" | "file-upload";

export type MixedWallpaperEntry = {
  id: string;
  kind: MixedWallpaperEntryKind;
  value: string;
  createdAt: number;
};

export type MixedUploadedWallpaperImageOptions = {
  size: string;
  x: string;
  y: string;
};

export type MixedUploadedWallpaperVideoOptions = {
  zoom: number;
  playbackRate: number;
  fade: number;
};

export type MixedUploadedWallpaperFileMeta = {
  id: string;
  name: string;
  mimeType: string;
  createdAt: number;
  lastUsedAt: number;
  imageOptions: MixedUploadedWallpaperImageOptions;
  videoOptions: MixedUploadedWallpaperVideoOptions;
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
    logger.log("Error compressing mixed wallpaper", err);
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
    logger.log("Error creating mixed wallpaper thumbnail", err);
    return file;
  }
};

const getMixedWallpaperCache = async () => {
  if (!canUseCacheStorage()) return null;

  try {
    return await caches.open(MIXED_WALLPAPER_CACHE_NAME);
  } catch (err) {
    logger.log("Error opening mixed wallpaper cache", err);
    return null;
  }
};

const getCacheKey = (id: string, size: "full" | "thumb") =>
  `https://wallpaper.invalid/mixed-files/${encodeURIComponent(id)}/${size}`;
const getBase64StorageKey = (id: string, size: "full" | "thumb") =>
  `${MIXED_UPLOADED_WALLPAPER_BASE64_KEY_PREFIX}:${id}:${size}`;

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
    logger.log("Error converting mixed wallpaper base64 to blob", err);
    return undefined;
  }
};

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
    logger.log("Error serializing mixed wallpaper file to base64", err);
    return false;
  }
};

const getBase64StoredFile = async (
  id: string,
  size: "full" | "thumb"
): Promise<Blob | undefined> => {
  const data = await getStorageLocal<string>(getBase64StorageKey(id, size));
  if (typeof data !== "string" || data.length === 0) return undefined;
  return await dataUrlToBlob(data);
};

const deleteBase64StoredFile = async (id: string) => {
  await setStorageLocal(getBase64StorageKey(id, "full"), null);
  await setStorageLocal(getBase64StorageKey(id, "thumb"), null);
};

const getCachedFile = async (id: string, size: "full" | "thumb"): Promise<Blob | undefined> => {
  const cache = await getMixedWallpaperCache();
  if (!cache) return await getBase64StoredFile(id, size);

  try {
    const response = await cache.match(getCacheKey(id, size));
    if (!response) return await getBase64StoredFile(id, size);

    const blob = await response.blob();
    void setBase64StoredFile({ id, size, file: blob });
    return blob;
  } catch (err) {
    logger.log("Error reading mixed wallpaper from CacheStorage", err);
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
  const cache = await getMixedWallpaperCache();
  if (!cache) return storedAsBase64;

  try {
    const headers = new Headers();
    if (file.type) headers.set("content-type", file.type);
    await cache.put(getCacheKey(id, size), new Response(file, { headers }));
    return true;
  } catch (err) {
    logger.log("Error writing mixed wallpaper to CacheStorage", err);
    return storedAsBase64;
  }
};

const deleteCachedFile = async (id: string) => {
  await deleteBase64StoredFile(id);

  const cache = await getMixedWallpaperCache();
  if (!cache) return;

  try {
    await cache.delete(getCacheKey(id, "full"));
    await cache.delete(getCacheKey(id, "thumb"));
  } catch (err) {
    logger.log("Error deleting mixed wallpaper from CacheStorage", err);
  }
};

const getMixedEntries = async (): Promise<MixedWallpaperEntry[]> => {
  const raw = await getStorageLocal<unknown>(MIXED_WALLPAPER_ENTRIES_KEY);
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const rawItem = item as Partial<MixedWallpaperEntry>;
      const kind = rawItem.kind;
      if (kind !== "url" && kind !== "solid-color" && kind !== "file-upload") return undefined;

      const value = typeof rawItem.value === "string" ? rawItem.value.trim() : "";
      if (!value) return undefined;

      const id = typeof rawItem.id === "string" ? rawItem.id : genid();
      const createdAt = Number.isFinite(rawItem.createdAt) ? Number(rawItem.createdAt) : Date.now();

      return {
        id,
        kind,
        value,
        createdAt
      } satisfies MixedWallpaperEntry;
    })
    .filter((item): item is MixedWallpaperEntry => !!item);
};

const setMixedEntries = async (entries: MixedWallpaperEntry[]) => {
  await setStorageLocal(MIXED_WALLPAPER_ENTRIES_KEY, entries);
};

const getMixedUploadedFilesMeta = async (): Promise<MixedUploadedWallpaperFileMeta[]> => {
  const data = await getStorageLocal<MixedUploadedWallpaperFileMeta[]>(
    MIXED_UPLOADED_WALLPAPER_FILES_KEY
  );
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

const setMixedUploadedFilesMeta = async (files: MixedUploadedWallpaperFileMeta[]) => {
  await setStorageLocal(MIXED_UPLOADED_WALLPAPER_FILES_KEY, files);
};

export const listMixedWallpaperEntries = async (): Promise<MixedWallpaperEntry[]> =>
  await getMixedEntries();

export const listMixedUploadedWallpaperFiles = async (): Promise<
  MixedUploadedWallpaperFileMeta[]
> => await getMixedUploadedFilesMeta();

export const addMixedWallpaperURL = async (
  url: string
): Promise<MixedWallpaperEntry | undefined> => {
  const normalized = url.trim();
  if (!normalized) return undefined;

  const entries = await getMixedEntries();
  const next: MixedWallpaperEntry = {
    id: genid(),
    kind: "url",
    value: normalized,
    createdAt: Date.now()
  };
  entries.push(next);
  await setMixedEntries(entries);
  return next;
};

export const addMixedWallpaperSolidColor = async (
  color: string
): Promise<MixedWallpaperEntry | undefined> => {
  const normalized = color.trim();
  if (!normalized) return undefined;

  const entries = await getMixedEntries();
  const next: MixedWallpaperEntry = {
    id: genid(),
    kind: "solid-color",
    value: normalized,
    createdAt: Date.now()
  };
  entries.push(next);
  await setMixedEntries(entries);
  return next;
};

export const updateMixedWallpaperEntryValue = async ({
  entryId,
  value
}: {
  entryId: string;
  value: string;
}): Promise<MixedWallpaperEntry | undefined> => {
  const normalized = value.trim();
  if (!normalized) return undefined;

  const entries = await getMixedEntries();
  const index = entries.findIndex((entry) => entry.id === entryId);
  if (index < 0) return undefined;

  const current = entries[index];
  if (current.kind === "file-upload") return undefined;

  const next: MixedWallpaperEntry = {
    ...current,
    value: normalized
  };

  entries[index] = next;
  await setMixedEntries(entries);
  return next;
};

export const addMixedUploadedWallpaperFiles = async (
  files: FileList | File[]
): Promise<MixedWallpaperEntry[]> => {
  const list = Array.from(files);
  if (list.length === 0) return [];

  const entries = await getMixedEntries();
  const currentFiles = await getMixedUploadedFilesMeta();
  const addedEntries: MixedWallpaperEntry[] = [];

  for (const file of list) {
    const fileId = genid();
    const optimized = await optimizeWallpaper(file);
    const thumb = await createThumbnail(optimized);
    const now = Date.now();

    const metadata: MixedUploadedWallpaperFileMeta = {
      id: fileId,
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

    await setCachedFile({ id: fileId, size: "full", file: optimized });
    await setCachedFile({ id: fileId, size: "thumb", file: thumb });
    currentFiles.push(metadata);

    const entry: MixedWallpaperEntry = {
      id: genid(),
      kind: "file-upload",
      value: fileId,
      createdAt: now
    };

    entries.push(entry);
    addedEntries.push(entry);
  }

  await setMixedUploadedFilesMeta(currentFiles);
  await setMixedEntries(entries);

  return addedEntries;
};

export const replaceMixedWallpaperEntryFile = async ({
  entryId,
  file
}: {
  entryId: string;
  file: File;
}): Promise<MixedWallpaperEntry | undefined> => {
  const entries = await getMixedEntries();
  const index = entries.findIndex((entry) => entry.id === entryId && entry.kind === "file-upload");
  if (index < 0) return undefined;

  const currentFiles = await getMixedUploadedFilesMeta();
  const currentEntry = entries[index];
  const oldFileId = currentEntry.value;

  const newFileId = genid();
  const optimized = await optimizeWallpaper(file);
  const thumb = await createThumbnail(optimized);
  const now = Date.now();

  const metadata: MixedUploadedWallpaperFileMeta = {
    id: newFileId,
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

  await setCachedFile({ id: newFileId, size: "full", file: optimized });
  await setCachedFile({ id: newFileId, size: "thumb", file: thumb });

  const nextEntry: MixedWallpaperEntry = {
    ...currentEntry,
    value: newFileId
  };
  entries[index] = nextEntry;

  const oldFileStillUsed = entries.some(
    (entry, entryIndex) =>
      entryIndex !== index && entry.kind === "file-upload" && entry.value === oldFileId
  );

  const nextFiles = [...currentFiles, metadata].filter(
    (item) => oldFileStillUsed || item.id !== oldFileId
  );

  if (!oldFileStillUsed) {
    await deleteCachedFile(oldFileId);
  }

  await setMixedUploadedFilesMeta(nextFiles);
  await setMixedEntries(entries);
  return nextEntry;
};

export const getMixedUploadedWallpaperFile = async (id: string): Promise<Blob | undefined> =>
  await getCachedFile(id, "full");

export const getMixedUploadedWallpaperThumbnail = async (id: string): Promise<Blob | undefined> =>
  await getCachedFile(id, "thumb");

export const removeMixedWallpaperEntries = async (entryIds: string[]) => {
  if (entryIds.length === 0) return;

  const removeIdSet = new Set(entryIds);
  const entries = await getMixedEntries();
  const removedEntries = entries.filter((entry) => removeIdSet.has(entry.id));
  const nextEntries = entries.filter((entry) => !removeIdSet.has(entry.id));

  const removedFileIds = new Set(
    removedEntries.filter((entry) => entry.kind === "file-upload").map((entry) => entry.value)
  );
  const remainingFileIds = new Set(
    nextEntries.filter((entry) => entry.kind === "file-upload").map((entry) => entry.value)
  );

  const fileIdsToDelete = Array.from(removedFileIds).filter((id) => !remainingFileIds.has(id));
  const files = await getMixedUploadedFilesMeta();
  const nextFiles = files.filter((file) => !fileIdsToDelete.includes(file.id));

  for (const fileId of fileIdsToDelete) {
    await deleteCachedFile(fileId);
  }

  await setMixedUploadedFilesMeta(nextFiles);
  await setMixedEntries(nextEntries);
};

export const reorderMixedWallpaperEntries = async (orderedEntryIds: string[]) => {
  if (orderedEntryIds.length === 0) return;

  const entries = await getMixedEntries();
  if (entries.length <= 1) return;

  const idToEntry = new Map(entries.map((entry) => [entry.id, entry]));
  const reordered: MixedWallpaperEntry[] = [];

  orderedEntryIds.forEach((id) => {
    const match = idToEntry.get(id);
    if (!match) return;
    reordered.push(match);
    idToEntry.delete(id);
  });

  reordered.push(...idToEntry.values());
  await setMixedEntries(reordered);
};

export const resetMixedWallpaperEntries = async () => {
  const files = await getMixedUploadedFilesMeta();

  for (const file of files) {
    await deleteCachedFile(file.id);
  }

  await setMixedUploadedFilesMeta([]);
  await setMixedEntries([]);
};
