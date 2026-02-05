import {
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperSolidColorInputEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { previewWallpaper, previewWallpaperSolidColor } from "src/options/scripts/utils/preview";

export const handleWallpaperChange = () => {
  wallpaperUrlInputEl.addEventListener("change", () => {
    previewWallpaper(
      wallpaperUrlInputEl.value,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
  });

  wallpaperSolidColorInputEl.addEventListener("change", () => {
    previewWallpaperSolidColor(wallpaperSolidColorInputEl.value);
  });
};
