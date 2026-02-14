import { WALLPAPER_HINT_LOCAL_KEY } from "src/utils/wallpaper-file-storage";
import { wallpaperEl } from "src/newtab/scripts/ui";
import { logger } from "src/utils/logger";

export const applyWallpaperFirstPaintHint = (): boolean => {
  try {
    const hint = localStorage.getItem(WALLPAPER_HINT_LOCAL_KEY);
    if (!hint) return false;

    wallpaperEl.style.backgroundImage = `url(${hint})`;
    wallpaperEl.style.backgroundSize = "cover";
    wallpaperEl.style.backgroundPosition = "center";
    wallpaperEl.dataset.wallpaperHint = "true";
    return true;
  } catch (err) {
    logger.log("Error applying wallpaper hint", err);
    return false;
  }
};
