import { Config } from "src/utils/config";
import { wallpaperEl } from "src/newtab/scripts/ui";
import { hideCover } from "src/newtab/scripts/utils/hide-cover";
import { get as idbGet } from "idb-keyval";

export const loadWallpaper = (wallpaper: Config["wallpaper"]) => {
  if (!wallpaper.enabled) return;

  if (wallpaper.type === "fileUpload") {
    idbGet("userUploadedWallpaper").then((file) => {
      if (file) {
        applyWallpaper(file, wallpaper.filters.brightness, wallpaper.filters.blur);
        hideCover();
      } else {
        // not in idb, handle legacy wallpaper

        chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
          applyWallpaperLegacy(
            data.userUploadedWallpaper,
            wallpaper.filters.brightness,
            wallpaper.filters.blur
          );
        });
      }
    });
  } else {
    applyWallpaper(wallpaper.url, wallpaper.filters.brightness, wallpaper.filters.blur);
    hideCover();
  }
};

const applyWallpaper = (wallpaper: Blob | string, brightness: string, blur: string) => {
  wallpaperEl.style.transitionDuration = "0ms";
  let src: string;

  if (wallpaper instanceof Blob) src = URL.createObjectURL(wallpaper);
  else src = wallpaper;

  const isVideo = wallpaper instanceof Blob && wallpaper.type.startsWith("video/");

  const mediaEl = isVideo ? document.createElement("video") : document.createElement("img");
  mediaEl.src = src;
  mediaEl.style.position = "absolute";
  mediaEl.style.width = "100%";
  mediaEl.style.height = "100%";
  mediaEl.style.objectFit = "cover";

  if (isVideo) {
    (mediaEl as HTMLVideoElement).autoplay = true;
    (mediaEl as HTMLVideoElement).loop = true;
    (mediaEl as HTMLVideoElement).muted = true;
  }

  applyWallpaperFilters(mediaEl, brightness, blur);
  wallpaperEl.appendChild(mediaEl);

  if (wallpaper instanceof Blob) {
    mediaEl.onload = () => URL.revokeObjectURL(src);
  }
};

const applyWallpaperFilters = (element: HTMLElement, brightness: string, blur: string) => {
  element.style.filter = `brightness(${brightness}) blur(${blur})`;
};

export const applyWallpaperLegacy = (url: string, brightness: string, blur: string) => {
  wallpaperEl.style.transitionDuration = "0ms";

  const imgEl = document.createElement("img");
  imgEl.src = url;
  imgEl.style.position = "absolute";
  imgEl.style.width = "100%";
  imgEl.style.height = "100%";
  imgEl.style.objectFit = "cover";

  applyWallpaperFilters(imgEl, brightness, blur);
  wallpaperEl.appendChild(imgEl);
};
