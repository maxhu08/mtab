import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeUrlButtonEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { previewWallpaper, previewWallpaperLegacy } from "src/options/scripts/utils/preview";
import { get as idbGet } from "idb-keyval";

export const fillWallpapersInputs = (config: Config) => {
  if (config.wallpaper.type === "url") {
    wallpaperTypeUrlButtonEl.click();

    previewWallpaper(
      config.wallpaper.url,
      config.wallpaper.filters.brightness,
      config.wallpaper.filters.blur
    );
  } else if (config.wallpaper.type === "fileUpload") {
    wallpaperTypeFileUploadButtonEl.click();

    idbGet("userUploadedWallpaper").then((file) => {
      if (file) {
        previewWallpaper(file, config.wallpaper.filters.brightness, config.wallpaper.filters.blur);
      } else {
        // not in idb, handle legacy wallpaper

        chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
          previewWallpaperLegacy(
            data.userUploadedWallpaper,
            config.wallpaper.filters.brightness,
            config.wallpaper.filters.blur
          );
        });
      }
    });
  }

  wallpaperEnabledCheckboxEl.checked = config.wallpaper.enabled;
  wallpaperUrlInputEl.value = config.wallpaper.url;

  wallpaperFiltersBrightnessInputEl.value = config.wallpaper.filters.brightness;
  wallpaperFiltersBlurInputEl.value = config.wallpaper.filters.blur;
};
