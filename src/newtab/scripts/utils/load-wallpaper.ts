import { Config } from "src/utils/config";
import { wallpaperEl } from "src/newtab/scripts/ui";
import { hideCover } from "src/newtab/scripts/utils/hide-cover";
import { get as idbGet } from "idb-keyval";

const applyWallpaperUrl = (url: string) => {
  wallpaperEl.style.background = `url("${url}") center center / cover no-repeat fixed`;
  wallpaperEl.style.transitionDuration = "0ms";
};

export const loadWallpaper = (wallpaper: Config["wallpaper"]) => {
  if (!wallpaper.enabled) return;

  if (wallpaper.type === "fileUpload") {
    idbGet("userUploadedWallpaper").then((file) => {
      if (file) {
        applyWallpaperUrl(URL.createObjectURL(file));
        hideCover();
      }
    });
  } else {
    applyWallpaperUrl(wallpaper.url);
    hideCover();
  }
};
