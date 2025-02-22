export const previewWallpaper = (wallpaper: Blob | undefined) => {
  // prettier-ignore
  const liveWallpaperPreviewEl = document.getElementById("live-wallpaper-preview") as HTMLDivElement;

  if (!wallpaper) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
  } else {
    const imageUrl = URL.createObjectURL(wallpaper);

    if (wallpaper.type.startsWith("image/")) {
      liveWallpaperPreviewEl.innerHTML = `<img src="${imageUrl}" class="w-full h-full" />`;
    } else if (wallpaper.type.startsWith("video/")) {
      liveWallpaperPreviewEl.innerHTML = `<video src="${imageUrl}" class="w-full h-full" autoplay loop muted />`;
    } else {
      liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
    }
  }
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
