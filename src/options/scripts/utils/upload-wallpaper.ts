import {
  wallpaperFileUploadInputEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl
} from "src/options/scripts/ui";
import { applyWallpaperFilters, previewWallpaper } from "src/options/scripts/utils/preview";
import { set as idbSet } from "idb-keyval";

export const handleWallpaperFileUpload = () => {
  wallpaperFileUploadInputEl.addEventListener("change", (e: any) => {
    const file = e.target.files[0];
    if (file) {
      idbSet("userUploadedWallpaper", file)
        .then(() => {
          previewWallpaper(
            file,
            wallpaperFiltersBrightnessInputEl.value,
            wallpaperFiltersBlurInputEl.value
          );
        })
        .catch((err) => {
          console.log("Error storing wallpaper in IndexedDB", err);
        });
    }
  });
};

export const handWallpaperFileReset = () => {
  idbSet("userUploadedWallpaper", null);
  previewWallpaper(undefined, "", "");
};

wallpaperFiltersBrightnessInputEl.onchange = () => {
  applyWallpaperFilters(wallpaperFiltersBrightnessInputEl.value, wallpaperFiltersBlurInputEl.value);
};

wallpaperFiltersBlurInputEl.onchange = () => {
  applyWallpaperFilters(wallpaperFiltersBrightnessInputEl.value, wallpaperFiltersBlurInputEl.value);
};
