import { Config } from "src/newtab/scripts/config";
import { wallpaperEnabledCheckboxEl, wallpaperUrlInputEl } from "src/options/scripts/ui";

export const saveWallpaperSettingsToDraft = (draft: Config) => {
  draft.wallpaper.enabled = wallpaperEnabledCheckboxEl.checked;

  draft.wallpaper.url = wallpaperUrlInputEl.value;
};
