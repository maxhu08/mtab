import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperTypeCollectionButtonEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeUrlButtonEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { previewWallpaper, previewWallpaperLegacy } from "src/options/scripts/utils/preview";
import { get as idbGet } from "idb-keyval";
import {
  fillCollectionWallpaper,
  handleWallpaperCollectionsDragging
} from "src/options/scripts/utils/fill-helpers/fill-collection-wallpaper";

export const fillWallpapersInputs = (config: Config) => {
  if (config.wallpaper.type === "url") wallpaperTypeUrlButtonEl.click();
  else if (config.wallpaper.type === "fileUpload") wallpaperTypeFileUploadButtonEl.click();
  else if (config.wallpaper.type === "collection") wallpaperTypeCollectionButtonEl.click();

  wallpaperEnabledCheckboxEl.checked = config.wallpaper.enabled;
  wallpaperUrlInputEl.value = config.wallpaper.url;

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

  wallpaperFiltersBrightnessInputEl.value = config.wallpaper.filters.brightness;
  wallpaperFiltersBlurInputEl.value = config.wallpaper.filters.blur;

  // must go before fill function
  handleWallpaperCollectionsDragging();
  fillCollectionWallpaper();
};
