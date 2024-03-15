import { getConfig } from "src/newtab/scripts/config";
import {
  animationsEnabledCheckboxEl,
  dynamicTitleEnabledCheckboxEl,
  titleInputEl,
  uiStyleGlassButtonEl,
  uiStyleSolidButtonEl,
  usernameInputEl,
  wallpaperEnabledCheckboxEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";

export const fillInputs = () => {
  getConfig(({ config }) => {
    titleInputEl.value = config.title;
    usernameInputEl.value = config.user.name;

    dynamicTitleEnabledCheckboxEl.checked = config.dynamicTitle.enabled;

    wallpaperEnabledCheckboxEl.checked = config.dynamicTitle.enabled;
    wallpaperUrlInputEl.value = config.wallpaper.url;

    switch (config.uiStyle) {
      case "solid": {
        uiStyleSolidButtonEl.click();
        break;
      }
      case "glass": {
        uiStyleGlassButtonEl.click();
        break;
      }
    }

    animationsEnabledCheckboxEl.checked = config.animations.enabled;
  });
};
