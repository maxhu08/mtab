import {
  wallpaperFileUploadInputEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl
} from "src/options/scripts/ui";
import { applyWallpaperFilters, previewWallpaper } from "src/options/scripts/utils/preview";
import { set as idbSet } from "idb-keyval";

export const handleWallpaperFileUpload = () => {
  wallpaperFileUploadInputEl.addEventListener("change", async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
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

      const base64String = await fileToBase64(file);
      chrome.storage.local.set({ userUploadedWallpaper: base64String });
    } catch (err) {
      console.log("Error storing wallpaper", err);
    }
  });
};

const fileToBase64 = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const handWallpaperFileReset = () => {
  idbSet("userUploadedWallpaper", null);
  chrome.storage.local.set({ userUploadedWallpaper: null }, () => {});
  previewWallpaper(undefined, "", "");
};

wallpaperFiltersBrightnessInputEl.onchange = () => {
  applyWallpaperFilters(wallpaperFiltersBrightnessInputEl.value, wallpaperFiltersBlurInputEl.value);
};

wallpaperFiltersBlurInputEl.onchange = () => {
  applyWallpaperFilters(wallpaperFiltersBrightnessInputEl.value, wallpaperFiltersBlurInputEl.value);
};
