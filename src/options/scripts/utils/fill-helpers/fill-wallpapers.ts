import { Config } from "src/utils/config";
import {
  wallpaperEnabledCheckboxEl,
  wallpaperResizeHInputEl,
  wallpaperResizeWInputEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeUrlButtonEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";

export const fillWallpapersInputs = (config: Config) => {
  if (config.wallpaper.type === "url") wallpaperTypeUrlButtonEl.click();
  else if (config.wallpaper.type === "fileUpload") wallpaperTypeFileUploadButtonEl.click();

  wallpaperEnabledCheckboxEl.checked = config.wallpaper.enabled;
  wallpaperUrlInputEl.value = config.wallpaper.url;

  wallpaperResizeWInputEl.value = config.wallpaper.resize.w.toString();
  wallpaperResizeHInputEl.value = config.wallpaper.resize.h.toString();

  chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
    previewWallpaper(data.userUploadedWallpaper);
  });
};
