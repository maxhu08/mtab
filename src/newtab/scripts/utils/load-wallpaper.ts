import { Config } from "src/newtab/scripts/config";
import { wallpaperEl } from "src/newtab/scripts/ui";

export const loadWallpaper = (config: Config) => {
  chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
    console.log(data);

    if (config.wallpaper.enabled) {
      wallpaperEl.setAttribute(
        "style",
        `background: url("${data.userUploadedWallpaper}") center center / cover no-repeat fixed; transition-duration: 0ms;`
      );
    }
  });

  // if (config.wallpaper.enabled) {
  //   wallpaperEl.setAttribute(
  //     "style",
  //     `background: url("${config.wallpaper.url}") center center / cover no-repeat fixed; transition-duration: 0ms;`
  //   );
  // }
};
