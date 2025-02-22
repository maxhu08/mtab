import { Config } from "src/utils/config";
import { wallpaperEl } from "src/newtab/scripts/ui";
import { hideCover } from "src/newtab/scripts/utils/hide-cover";
import { get as idbGet } from "idb-keyval";

const applyWallpaper = (wallpaper: Blob | string) => {
  if (wallpaper instanceof Blob) {
    const objectUrl = URL.createObjectURL(wallpaper);

    if (wallpaper.type.startsWith("image/")) {
      wallpaperEl.style.background = `url("${objectUrl}") center center / cover no-repeat fixed`;
    } else if (wallpaper.type.startsWith("video/")) {
      const videoEl = document.createElement("video");
      videoEl.src = objectUrl;
      videoEl.autoplay = true;
      videoEl.loop = true;
      videoEl.muted = true;
      videoEl.style.position = "absolute";
      videoEl.style.top = "0";
      videoEl.style.left = "0";
      videoEl.style.width = "100%";
      videoEl.style.height = "100%";
      videoEl.style.objectFit = "cover";
      videoEl.style.zIndex = "-1";

      const existingVideo = wallpaperEl.querySelector("video");
      if (existingVideo) {
        wallpaperEl.removeChild(existingVideo);
      }

      wallpaperEl.appendChild(videoEl);
    }
  } else {
    wallpaperEl.style.background = `url("${wallpaper}") center center / cover no-repeat fixed`;
  }

  wallpaperEl.style.transitionDuration = "0ms";
};

export const loadWallpaper = (wallpaper: Config["wallpaper"]) => {
  if (!wallpaper.enabled) return;

  if (wallpaper.type === "fileUpload") {
    idbGet("userUploadedWallpaper").then((file) => {
      if (file) {
        applyWallpaper(file);
        hideCover();
      }
    });
  } else {
    applyWallpaper(wallpaper.url);
    hideCover();
  }
};
