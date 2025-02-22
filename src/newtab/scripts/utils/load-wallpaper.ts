import { Config } from "src/utils/config";
import { wallpaperEl } from "src/newtab/scripts/ui";
import { hideCover } from "src/newtab/scripts/utils/hide-cover";
import { get as idbGet } from "idb-keyval";

const applyWallpaper = (wallpaper: Blob | string) => {
  const imgEl = wallpaperEl.querySelector("img") || document.createElement("img");

  if (wallpaper instanceof Blob) {
    const objectUrl = URL.createObjectURL(wallpaper);

    if (wallpaper.type.startsWith("image/")) {
      imgEl.src = objectUrl;
      imgEl.style.position = "absolute";
      imgEl.style.top = "0";
      imgEl.style.left = "0";
      imgEl.style.width = "100%";
      imgEl.style.height = "100%";
      imgEl.style.objectFit = "cover";
      imgEl.style.zIndex = "-1";
      wallpaperEl.appendChild(imgEl);
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
      wallpaperEl.appendChild(videoEl);
    }
  }

  wallpaperEl.style.transitionDuration = "0ms";
};

export const loadWallpaper = (wallpaper: Config["wallpaper"]) => {
  console.log("RAN");
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
