import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperResizeHInputEl,
  wallpaperResizeWInputEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";

export const saveWallpaperSettingsToDraft = (draft: Config) => {
  const selectedEl = getSelectedButton("wallpaper-type");

  if (selectedEl) {
    if (selectedEl.id === "wallpaper-type-url-button") {
      draft.wallpaper.type = "url";
    } else if (selectedEl.id === "wallpaper-type-file-upload-button") {
      draft.wallpaper.type = "fileUpload";
    }
  }

  draft.wallpaper.enabled = wallpaperEnabledCheckboxEl.checked;
  draft.wallpaper.url = wallpaperUrlInputEl.value;

  draft.wallpaper.resize.w = parseInt(wallpaperResizeWInputEl.value);
  draft.wallpaper.resize.h = parseInt(wallpaperResizeHInputEl.value);
};
