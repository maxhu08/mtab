export const previewWallpaper = (wallpaper: string) => {
  // prettier-ignore
  const liveWallpaperPreviewEl = document.getElementById("live-wallpaper-preview") as HTMLDivElement;

  liveWallpaperPreviewEl.innerHTML = `<img src="${wallpaper}" class="w-full h-full" />`;
};

export const previewFavicon = (favicon: string) => {
  // prettier-ignore
  const liveFaviconPreviewEl = document.getElementById("live-favicon-preview") as HTMLDivElement;

  liveFaviconPreviewEl.innerHTML = `<img src="${favicon}" class="w-full h-full" />`;
};
