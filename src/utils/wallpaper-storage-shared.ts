type WallpaperFileMetaBase = {
  id: string;
  name: string;
  mimeType: string;
  createdAt: number;
  lastUsedAt: number;
};

type CachedWallpaperFileWriter = (params: {
  id: string;
  size: "full" | "thumb";
  file: Blob;
}) => Promise<unknown>;

export const createWallpaperFileMeta = <T extends WallpaperFileMetaBase>(base: T) => ({
  ...base,
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
});

export const cacheWallpaperFiles = async (
  writeCachedFile: CachedWallpaperFileWriter,
  id: string,
  optimized: Blob,
  thumb: Blob
) => {
  await writeCachedFile({ id, size: "full", file: optimized });
  await writeCachedFile({ id, size: "thumb", file: thumb });
};