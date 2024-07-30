import { wallpaperFileInputEl } from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";

export const handleWallpaperFileUpload = () => {
  wallpaperFileInputEl.addEventListener("change", (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // resize image to 1920x1080 because chrome can't store really large images
        resizeImage(e.target.result, 1920, 1080, (resizedDataUrl) => {
          chrome.storage.local.set({ userUploadedWallpaper: resizedDataUrl });
          previewWallpaper(resizedDataUrl);
        });
      };
      reader.readAsDataURL(file);
    }
  });
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
