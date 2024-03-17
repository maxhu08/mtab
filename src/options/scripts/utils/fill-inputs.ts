import { getConfig } from "src/newtab/scripts/config";
import {
  animationsEnabledCheckboxEl,
  dynamicTitleEnabledCheckboxEl,
  messageFontInputEl,
  titleInputEl,
  uiStyleGlassButtonEl,
  uiStyleSolidButtonEl,
  usernameInputEl,
  wallpaperEnabledCheckboxEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";

export const fillInputs = () => {
  getConfig(({ config }) => {
    // *** user ***
    usernameInputEl.value = config.user.name;

    // *** title ***
    titleInputEl.value = config.title;
    dynamicTitleEnabledCheckboxEl.checked = config.dynamicTitle.enabled;

    // *** message ***
    messageFontInputEl.value = config.message.font;

    // *** wallpaper ***
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
