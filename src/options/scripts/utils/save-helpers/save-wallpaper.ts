import { Config } from "src/newtab/scripts/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperResizeHInputEl,
  wallpaperResizeWInputEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";

export const saveWallpaperSettingsToDraft = (draft: Config) => {
  const selectedEl = document.querySelector(
    `button[btn-option-type="wallpaper-type"][selected="yes"]`
  ) as HTMLButtonElement;

  if (selectedEl.id === "wallpaper-type-url-button") draft.wallpaper.type = "url";
  // prettier-ignore
  else if (selectedEl.id === "wallpaper-type-file-upload-button") draft.wallpaper.type = "fileUpload";

  draft.wallpaper.enabled = wallpaperEnabledCheckboxEl.checked;
  draft.wallpaper.url = wallpaperUrlInputEl.value;

  draft.wallpaper.resize.w = parseInt(wallpaperResizeWInputEl.value);
  draft.wallpaper.resize.h = parseInt(wallpaperResizeHInputEl.value);
};
