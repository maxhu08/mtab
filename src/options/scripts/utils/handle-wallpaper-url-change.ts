import {
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { previewWallpaper } from "src/options/scripts/utils/preview";

export const handleWallpaperUrlChange = () => {
  wallpaperUrlInputEl.addEventListener("change", (e: any) => {
    previewWallpaper(
      wallpaperUrlInputEl.value,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
  });
};
