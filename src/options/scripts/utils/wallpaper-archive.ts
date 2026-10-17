import { zipSync } from "fflate";
import { wallpaperFilename } from "~/src/options/scripts/utils/download-file";

export const createWallpaperArchive = async (
  files: { name: string; file: Blob; scope: "file-upload" | "mixed" }[]
) => {
  const entries: Record<string, Uint8Array> = {};

  for (const [index, item] of files.entries()) {
    entries[`${item.scope}/${index + 1}-${wallpaperFilename(item.name, item.file.type)}`] =
      new Uint8Array(await item.file.arrayBuffer());
  }

  // uploaded media is already compressed; storing it avoids unnecessary recompression.
  const archive = zipSync(entries, { level: 0 });

  return new Blob([new Uint8Array(archive)], { type: "application/zip" });
};