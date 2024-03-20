import { Config } from "src/newtab/scripts/config";
import { wallpaperEnabledCheckboxEl, wallpaperUrlInputEl } from "src/options/scripts/ui";

export const fillWallpapersInputs = (config: Config) => {
  wallpaperEnabledCheckboxEl.checked = config.dynamicTitle.enabled;
  wallpaperUrlInputEl.value = config.wallpaper.url;
};
