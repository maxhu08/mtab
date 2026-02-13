import {
  wallpaperFileUploadInputEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl
} from "src/options/scripts/ui";
import { applyWallpaperFilters, previewWallpaper } from "src/options/scripts/utils/preview";
import { logger } from "src/utils/logger";
import {
  resetUploadedWallpaperFile,
  saveUploadedWallpaperFile
} from "src/utils/wallpaper-file-storage";

export const handleWallpaperFileUpload = () => {
  wallpaperFileUploadInputEl.addEventListener("change", async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      await saveUploadedWallpaperFile(file);
      previewWallpaper(
        file,
        wallpaperFiltersBrightnessInputEl.value,
        wallpaperFiltersBlurInputEl.value
      );
    } catch (err) {
      logger.log("Error storing wallpaper", err);
    }
  });
};

export const handWallpaperFileReset = () => {
  void resetUploadedWallpaperFile();
  previewWallpaper(undefined, "", "");
};

const getPreviewMediaEl = () =>
  document.querySelector("#live-wallpaper-preview img, #live-wallpaper-preview video") as
    | HTMLImageElement
    | HTMLVideoElement
    | null;

wallpaperFiltersBrightnessInputEl.onchange = () => {
  const mediaEl = getPreviewMediaEl();
  if (!mediaEl) return;
  applyWallpaperFilters(
    mediaEl,
    wallpaperFiltersBrightnessInputEl.value,
    wallpaperFiltersBlurInputEl.value
  );
};

wallpaperFiltersBlurInputEl.onchange = () => {
  const mediaEl = getPreviewMediaEl();
  if (!mediaEl) return;
  applyWallpaperFilters(
    mediaEl,
    wallpaperFiltersBrightnessInputEl.value,
    wallpaperFiltersBlurInputEl.value
  );
};
