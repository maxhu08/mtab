import { getConfig } from "src/newtab/scripts/config";
import {
  animationsBookmarkTimingLeftButtonEl,
  animationsBookmarkTimingRightButtonEl,
  animationsBookmarkTimingUniformButtonEl,
  animationsEnabledCheckboxEl,
  dynamicTitleEnabledCheckboxEl,
  messageCustomTextInputEl,
  messageFontInputEl,
  messageTypeAfternoonMorningButtonEl,
  messageTypeCustomButtonEl,
  messageTypeDateButtonEl,
  messageTypeTime12ButtonEl,
  messageTypeTime24ButtonEl,
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

    switch (config.message.type) {
      case "afternoon-morning": {
        messageTypeAfternoonMorningButtonEl.click();
        break;
      }
      case "date": {
        messageTypeDateButtonEl.click();
        break;
      }
      case "time-12": {
        messageTypeTime12ButtonEl.click();
        break;
      }
      case "time-24": {
        messageTypeTime24ButtonEl.click();
        break;
      }
      case "custom": {
        messageTypeCustomButtonEl.click();
        break;
      }
    }

    messageCustomTextInputEl.value = config.message.customText;

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

    switch (config.animations.bookmarkTiming) {
      case "left": {
        animationsBookmarkTimingLeftButtonEl.click();
        break;
      }
      case "right": {
        animationsBookmarkTimingRightButtonEl.click();
        break;
      }
      case "uniform": {
        animationsBookmarkTimingUniformButtonEl.click();
        break;
      }
    }
  });
};
