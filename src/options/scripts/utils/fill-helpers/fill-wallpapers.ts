import { Config } from "src/newtab/scripts/config";
import { wallpaperEnabledCheckboxEl, wallpaperTypeFileUploadButtonEl, wallpaperTypeUrlButtonEl, wallpaperUrlInputEl } from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";

export const fillWallpapersInputs = (config: Config) => {
  switch (config.wallpaper.type) {
    case "url": {
      wallpaperTypeUrlButtonEl.click();
      break;
    }
    case "fileUpload": {
      wallpaperTypeFileUploadButtonEl.click();
      break;
    }
  }

  wallpaperEnabledCheckboxEl.checked = config.wallpaper.enabled;
  wallpaperUrlInputEl.value = config.wallpaper.url;

  chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
    previewWallpaper(data.userUploadedWallpaper);
  });
};
