import {
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";

export const handleWallpaperUrlChange = () => {
  wallpaperUrlInputEl.addEventListener("change", () => {
    previewWallpaper(
      wallpaperUrlInputEl.value,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
  });
};
