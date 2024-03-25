import { Config } from "src/newtab/scripts/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeUrlButtonEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";

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
};
