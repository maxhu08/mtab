import { Config } from "src/newtab/scripts/config";
import { wallpaperEl } from "src/newtab/scripts/ui";
import { hideCover } from "src/newtab/scripts/utils/hide-cover";

const applyWallpaper = (url: string) => {
  wallpaperEl.style.background = `url("${url}") center center / cover no-repeat fixed`;
  wallpaperEl.style.transitionDuration = "0ms";
};

export const loadWallpaper = (wallpaper: Config["wallpaper"]) => {
  if (!wallpaper.enabled) return;

  if (wallpaper.type === "fileUpload") {
    chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
      const userUploadedWallpaper = data.userUploadedWallpaper;
      if (userUploadedWallpaper) {
        applyWallpaper(userUploadedWallpaper);
        hideCover();
      }
    });
  } else {
    applyWallpaper(wallpaper.url);
    hideCover();
  }
};
