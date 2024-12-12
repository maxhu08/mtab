import { Config } from "src/newtab/scripts/config";
import { coverEl, wallpaperEl } from "src/newtab/scripts/ui";

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
        coverEl.classList.add("opacity-0");
      }
    });
  } else {
    applyWallpaper(wallpaper.url);
    coverEl.classList.add("opacity-0");
  }
};
