import { wallpaperFileUploadInputEl } from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";

export const handleWallpaperFileUpload = () => {
  wallpaperFileUploadInputEl.addEventListener("change", (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      const reader = new FileReader();

      if (fileType.startsWith("image/") && fileType !== "image/gif") {
        // resize images
        reader.onload = (e: any) => {
          resizeImage(e.target.result, 1920, 1080, (resizedDataUrl) => {
            chrome.storage.local.set({ userUploadedWallpaper: resizedDataUrl });
            previewWallpaper(resizedDataUrl);
          });
        };
        reader.readAsDataURL(file);
      } else if (fileType === "image/gif" || fileType.startsWith("video/")) {
        // don't resize gifs and videos
        reader.onload = (e: any) => {
          const fileDataUrl = e.target.result;
          chrome.storage.local.set({ userUploadedWallpaper: fileDataUrl });
          previewWallpaper(fileDataUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  });
};

export const handWallpaperFileReset = () => {
  chrome.storage.local.set({ userUploadedWallpaper: null });
  previewWallpaper("");
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
