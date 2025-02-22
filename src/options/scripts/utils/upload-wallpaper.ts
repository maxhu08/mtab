import { wallpaperFileUploadInputEl } from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";
import { set as idbSet, get as idbGet } from "idb-keyval";

export const handleWallpaperFileUpload = () => {
  wallpaperFileUploadInputEl.addEventListener("change", (e: any) => {
    const file = e.target.files[0];
    if (file) {
      idbSet("userUploadedWallpaper", file)
        .then(() => {
          previewWallpaper(file);

          console.log("Wallpaper stored successfully in IndexedDB");

          idbGet("userUploadedWallpaper").then((storedValue) => {
            console.log("Stored wallpaper (Blob):", storedValue);
          });
        })
        .catch((err) => {
          console.log("Error storing wallpaper in IndexedDB", err);
        });
    }
  });
};

export const handWallpaperFileReset = () => {
  chrome.storage.local.set({ userUploadedWallpaper: null });
  previewWallpaper(undefined);
};
