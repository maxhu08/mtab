import { wallpaperFileInputEl } from "src/options/scripts/ui";

export const handleWallpaperFileUpload = () => {
  wallpaperFileInputEl.addEventListener("change", (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        console.log(file);

        chrome.storage.local.set({ userUploadedWallpaper: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  });
};
