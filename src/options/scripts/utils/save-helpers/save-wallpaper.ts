import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperUrlInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperFiltersBlurInputEl
} from "src/options/scripts/ui";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";

export const saveWallpaperSettingsToDraft = (draft: Config) => {
  const selectedEl = getSelectedButton("wallpaper-type");

  if (selectedEl) {
    if (selectedEl.id === "wallpaper-type-url-button") {
      draft.wallpaper.type = "url";
    } else if (selectedEl.id === "wallpaper-type-file-upload-button") {
      draft.wallpaper.type = "fileUpload";
    } else if (selectedEl.id === "wallpaper-type-default-button") {
      draft.wallpaper.type = "default";
    }
  }

  draft.wallpaper.enabled = wallpaperEnabledCheckboxEl.checked;
  draft.wallpaper.url = wallpaperUrlInputEl.value;

  draft.wallpaper.filters.brightness = wallpaperFiltersBrightnessInputEl.value;
  draft.wallpaper.filters.blur = wallpaperFiltersBlurInputEl.value;
};
