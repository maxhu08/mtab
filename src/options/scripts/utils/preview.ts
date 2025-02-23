const liveWallpaperPreviewEl = document.getElementById("live-wallpaper-preview") as HTMLDivElement;

export const previewWallpaper = (wallpaper: Blob | undefined, brightness: string, blur: string) => {
  if (!wallpaper) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
    return;
  }

  const imageUrl = URL.createObjectURL(wallpaper);
  const isVideo = wallpaper.type.startsWith("video/");

  const mediaEl = isVideo ? document.createElement("video") : document.createElement("img");
  mediaEl.src = imageUrl;
  mediaEl.className = "w-full h-full";
  applyWallpaperFilters(brightness, blur);

  if (isVideo) {
    (mediaEl as HTMLVideoElement).autoplay = true;
    (mediaEl as HTMLVideoElement).loop = true;
    (mediaEl as HTMLVideoElement).muted = true;
  }

  liveWallpaperPreviewEl.innerHTML = "";
  liveWallpaperPreviewEl.appendChild(mediaEl);

  mediaEl.onload = () => URL.revokeObjectURL(imageUrl);
};

export const applyWallpaperFilters = (brightness: string, blur: string) => {
  liveWallpaperPreviewEl.style.filter = `brightness(${brightness}) blur(${blur})`;
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
