import { Config } from "src/newtab/scripts/config";
import {
  titleDefaultTitleInputEl,
  titleDynamicEnabledCheckboxEl,
  titleFaviconTypeCustomButtonEl,
  titleFaviconTypeDefaultButtonEl
} from "src/options/scripts/ui";

export const fillTitleInputs = (config: Config) => {
  titleDefaultTitleInputEl.value = config.title.defaultTitle;
  titleDynamicEnabledCheckboxEl.checked = config.title.dynamic.enabled;

  switch (config.title.faviconType) {
    case "default": {
      titleFaviconTypeDefaultButtonEl.click();
      break;
    }
    case "custom": {
      titleFaviconTypeCustomButtonEl.click();
      break;
    }
  }
};
