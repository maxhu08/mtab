import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperSolidColorInputEl,
  wallpaperTypeDefaultButtonEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeSolidColorButtonEl,
  wallpaperTypeUrlButtonEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import {
  previewWallpaper,
  previewWallpaperSolidColor
} from "src/options/scripts/utils/preview";
import { getStoredWallpaperFile } from "src/utils/wallpaper-file-storage";

export const fillWallpapersInputs = (config: Config) => {
  if (config.wallpaper.type === "url") {
    wallpaperTypeUrlButtonEl.click();

    previewWallpaper(
      config.wallpaper.url,
      config.wallpaper.filters.brightness,
      config.wallpaper.filters.blur
    );
  } else if (config.wallpaper.type === "file-upload") {
    wallpaperTypeFileUploadButtonEl.click();

    getStoredWallpaperFile().then((file) => {
      previewWallpaper(file, config.wallpaper.filters.brightness, config.wallpaper.filters.blur);
    });
  } else if (config.wallpaper.type === "solid-color") {
    wallpaperTypeSolidColorButtonEl.click();

    previewWallpaperSolidColor(config.wallpaper.solidColor);
  } else if (config.wallpaper.type === "default") {
    wallpaperTypeDefaultButtonEl.click();

    previewWallpaper("", config.wallpaper.filters.brightness, config.wallpaper.filters.blur);
  }

  wallpaperEnabledCheckboxEl.checked = config.wallpaper.enabled;
  wallpaperUrlInputEl.value = config.wallpaper.url;

  wallpaperFiltersBrightnessInputEl.value = config.wallpaper.filters.brightness;
  wallpaperFiltersBlurInputEl.value = config.wallpaper.filters.blur;

  wallpaperSolidColorInputEl.value = config.wallpaper.solidColor;
};
