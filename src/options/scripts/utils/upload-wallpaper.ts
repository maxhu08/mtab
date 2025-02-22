import {
  wallpaperFileUploadInputEl,
  wallpaperResizeHInputEl,
  wallpaperResizeWInputEl
} from "src/options/scripts/ui";
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

const resizeImage = (
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
  callback: (resizedDataUrl: string) => void
) => {
  const img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height *= maxWidth / width));
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width *= maxHeight / height));
        height = maxHeight;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL("image/jpeg"));
  };
};
