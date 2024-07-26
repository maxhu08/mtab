import { Config } from "src/newtab/scripts/config";
import { wallpaperEl } from "src/newtab/scripts/ui";

export const loadWallpaper = (config: Config) => {
  if (!config.wallpaper.enabled) return;

  if (config.wallpaper.type === "fileUpload") {
    chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
      wallpaperEl.setAttribute(
        "style",
        `background: url("${data.userUploadedWallpaper}") center center / cover no-repeat fixed; transition-duration: 0ms;`
      );
    });
    return;
  }

  wallpaperEl.setAttribute(
    "style",
    `background: url("${config.wallpaper.url}") center center / cover no-repeat fixed; transition-duration: 0ms;`
  );
};
