import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperFrequencyConstantButtonEl,
  wallpaperFrequencyDaylightButtonEl,
  wallpaperFrequencyEveryDayButtonEl,
  wallpaperFrequencyEveryHourButtonEl,
  wallpaperFrequencyEveryTabButtonEl,
  wallpaperTypeDefaultButtonEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeMixedButtonEl,
  wallpaperTypeRandomButtonEl,
  wallpaperTypeSolidColorButtonEl,
  wallpaperTypeUrlButtonEl
} from "src/options/scripts/ui";
import {
  renderWallpaperGallery,
  setWallpaperSolidColorsInState,
  setWallpaperURLsInState
} from "src/options/scripts/utils/upload-wallpaper";

const selectWallpaperFrequencyButton = (frequency: Config["wallpaper"]["frequency"]) => {
  if (frequency === "every-tab") {
    wallpaperFrequencyEveryTabButtonEl.click();
    return;
  }

  if (frequency === "every-hour") {
    wallpaperFrequencyEveryHourButtonEl.click();
    return;
  }

  if (frequency === "every-day") {
    wallpaperFrequencyEveryDayButtonEl.click();
    return;
  }

  if (frequency === "daylight") {
    wallpaperFrequencyDaylightButtonEl.click();
    return;
  }

  wallpaperFrequencyConstantButtonEl.click();
};

export const fillWallpapersInputs = (config: Config) => {
  if (config.wallpaper.type === "url") {
    wallpaperTypeUrlButtonEl.click();
  } else if (config.wallpaper.type === "file-upload") {
    wallpaperTypeFileUploadButtonEl.click();
  } else if (config.wallpaper.type === "random") {
    wallpaperTypeRandomButtonEl.click();
  } else if (config.wallpaper.type === "solid-color") {
    wallpaperTypeSolidColorButtonEl.click();
  } else if (config.wallpaper.type === "mixed") {
    wallpaperTypeMixedButtonEl.click();
  } else {
    wallpaperTypeDefaultButtonEl.click();
  }

  selectWallpaperFrequencyButton(config.wallpaper.frequency);

  wallpaperEnabledCheckboxEl.checked = config.wallpaper.enabled;

  setWallpaperURLsInState(config.wallpaper.urls);
  setWallpaperSolidColorsInState(config.wallpaper.solidColors);

  wallpaperFiltersBrightnessInputEl.value = config.wallpaper.filters.brightness;
  wallpaperFiltersBlurInputEl.value = config.wallpaper.filters.blur;

  void renderWallpaperGallery();
};
