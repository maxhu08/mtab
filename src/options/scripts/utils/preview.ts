export const previewWallpaper = (wallpaper: Blob | undefined) => {
  // prettier-ignore
  const liveWallpaperPreviewEl = document.getElementById("live-wallpaper-preview") as HTMLDivElement;

  if (!wallpaper) {
    liveWallpaperPreviewEl.innerHTML = `<i class="text-neutral-500 text-4xl ri-prohibited-2-line"></i>`;
  } else {
    const imageUrl = URL.createObjectURL(wallpaper);
    liveWallpaperPreviewEl.innerHTML = `<img src="${imageUrl}" class="w-full h-full" />`;
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
