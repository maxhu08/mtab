import { Config } from "src/utils/config";
import {
  titleDefaultTitleInputEl,
  titleDynamicEnabledCheckboxEl,
  titleFaviconTypeCustomButtonEl,
  titleFaviconTypeDefaultButtonEl
} from "src/options/scripts/ui";
import { previewFavicon } from "src/options/scripts/utils/preview";

export const fillTitleInputs = (config: Config) => {
  titleDefaultTitleInputEl.value = config.title.defaultTitle;
  titleDynamicEnabledCheckboxEl.checked = config.title.dynamic.enabled;

  if (config.title.faviconType === "default") titleFaviconTypeDefaultButtonEl.click();
  else if (config.title.faviconType === "custom") titleFaviconTypeCustomButtonEl.click();

  chrome.storage.local.get(["userUploadedFavicon"], (data) => {
    previewFavicon(data.userUploadedFavicon);
  });
};
