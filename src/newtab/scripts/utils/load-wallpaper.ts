import { Config } from "src/newtab/scripts/config";
import { wallpaperEl } from "src/newtab/scripts/ui";

export const loadWallpaper = (config: Config) => {
  if (config.wallpaper.enabled) {
    wallpaperEl.setAttribute(
      "style",
      `background: url("${config.wallpaper.url}") center center / cover no-repeat fixed; transition-duration: 0ms;`
    );
  }
};
