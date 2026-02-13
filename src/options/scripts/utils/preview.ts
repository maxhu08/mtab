import { wallpaperTypeDefaultButtonEl } from "src/options/scripts/ui";

const liveWallpaperPreviewEl = document.getElementById("live-wallpaper-preview") as HTMLDivElement;

export const isWallpaperTypeDefault = () =>
  wallpaperTypeDefaultButtonEl.getAttribute("selected") === "yes";

export const previewWallpaper = (
  wallpaper: Blob | string | undefined,
  brightness: string,
  blur: string
) => {
  if (isWallpaperTypeDefault()) wallpaper = "./wallpapers/default.jpg";

  if (!wallpaper) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
    liveWallpaperPreviewEl.style.filter = "";
    return;
  }

  let src: string;
  if (wallpaper instanceof Blob) src = URL.createObjectURL(wallpaper);
  else src = wallpaper;

  const isVideo =
    (wallpaper instanceof Blob && wallpaper.type.startsWith("video/")) ||
    (typeof wallpaper === "string" &&
      (wallpaper.startsWith("data:video/") || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(wallpaper)));

  const mediaEl = isVideo ? document.createElement("video") : document.createElement("img");
  mediaEl.src = src;
  mediaEl.className = "w-full h-full object-cover";

  if (isVideo) {
    const videoEl = mediaEl as HTMLVideoElement;
    videoEl.autoplay = true;
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
  }

  liveWallpaperPreviewEl.style.filter = "";
  applyWallpaperFilters(mediaEl, brightness, blur);

  liveWallpaperPreviewEl.innerHTML = "";
  liveWallpaperPreviewEl.appendChild(mediaEl);

  if (wallpaper instanceof Blob) {
    (mediaEl as HTMLImageElement).onload = () => URL.revokeObjectURL(src);
  }
};

export const applyWallpaperFilters = (el: HTMLElement, brightness: string, blur: string) => {
  el.style.filter = `brightness(${brightness}) blur(${blur})`;
};

export const previewWallpaperLegacy = (
  wallpaperBase64: string,
  brightness: string,
  blur: string
) => {
  liveWallpaperPreviewEl.style.filter = "";

  if (!wallpaperBase64) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
  } else {
    liveWallpaperPreviewEl.innerHTML = "";
    const img = document.createElement("img");
    img.src = wallpaperBase64;
    img.className = "w-full h-full object-cover";
    applyWallpaperFilters(img, brightness, blur);
    liveWallpaperPreviewEl.appendChild(img);
  }
};

export const previewWallpaperSolidColor = (color: string) => {
  liveWallpaperPreviewEl.style.filter = "";

  if (!color) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
    return;
  }

  liveWallpaperPreviewEl.innerHTML = "";

  const solidEl = document.createElement("div");
  solidEl.className = "w-full h-full";
  solidEl.style.backgroundColor = color;

  liveWallpaperPreviewEl.appendChild(solidEl);
};

export const previewFavicon = (favicon: string) => {
  // prettier-ignore
  const liveFaviconPreviewEl = document.getElementById("live-favicon-preview") as HTMLDivElement;

  if (!favicon) {
    liveFaviconPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
  } else {
    liveFaviconPreviewEl.innerHTML = `<img src="${favicon}" class="w-full h-full" />`;
  }
};
