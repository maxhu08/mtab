import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperFiltersBlurInputEl
} from "src/options/scripts/ui";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";
import {
  getWallpaperSolidColorsFromState,
  getWallpaperURLsFromState
} from "src/options/scripts/utils/upload-wallpaper";

export const saveWallpaperSettingsToDraft = (draft: Config) => {
  const selectedEl = getSelectedButton("wallpaper-type");

  if (selectedEl) {
    if (selectedEl.id === "wallpaper-type-url-button") {
      draft.wallpaper.type = "url";
    } else if (selectedEl.id === "wallpaper-type-file-upload-button") {
      draft.wallpaper.type = "file-upload";
    } else if (selectedEl.id === "wallpaper-type-random-button") {
      draft.wallpaper.type = "random";
    } else if (selectedEl.id === "wallpaper-type-solid-color-button") {
      draft.wallpaper.type = "solid-color";
    } else if (selectedEl.id === "wallpaper-type-default-button") {
      draft.wallpaper.type = "default";
    }
  }

  const selectedFrequencyEl = getSelectedButton("wallpaper-frequency");
  if (selectedFrequencyEl) {
    if (selectedFrequencyEl.id === "wallpaper-frequency-constant-button") {
      draft.wallpaper.frequency = "constant";
    } else if (selectedFrequencyEl.id === "wallpaper-frequency-every-tab-button") {
      draft.wallpaper.frequency = "every-tab";
    } else if (selectedFrequencyEl.id === "wallpaper-frequency-every-hour-button") {
      draft.wallpaper.frequency = "every-hour";
    } else if (selectedFrequencyEl.id === "wallpaper-frequency-every-day-button") {
      draft.wallpaper.frequency = "every-day";
    } else if (selectedFrequencyEl.id === "wallpaper-frequency-daylight-button") {
      draft.wallpaper.frequency = "daylight";
    }
  }

  draft.wallpaper.enabled = wallpaperEnabledCheckboxEl.checked;
  draft.wallpaper.urls = getWallpaperURLsFromState();
  draft.wallpaper.solidColors = getWallpaperSolidColorsFromState();

  draft.wallpaper.filters.brightness = wallpaperFiltersBrightnessInputEl.value;
  draft.wallpaper.filters.blur = wallpaperFiltersBlurInputEl.value;
};
