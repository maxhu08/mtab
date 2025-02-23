import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeUrlButtonEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";
import { get as idbGet } from "idb-keyval";

export const fillWallpapersInputs = (config: Config) => {
  if (config.wallpaper.type === "url") wallpaperTypeUrlButtonEl.click();
  else if (config.wallpaper.type === "fileUpload") wallpaperTypeFileUploadButtonEl.click();

  wallpaperEnabledCheckboxEl.checked = config.wallpaper.enabled;
  wallpaperUrlInputEl.value = config.wallpaper.url;

  idbGet("userUploadedWallpaper").then((file) => {
    previewWallpaper(file, config.wallpaper.filters.brightness, config.wallpaper.filters.blur);
  });

  wallpaperFiltersBrightnessInputEl.value = config.wallpaper.filters.brightness;
  wallpaperFiltersBlurInputEl.value = config.wallpaper.filters.blur;
};
