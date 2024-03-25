import { Config } from "src/newtab/scripts/config";
import { titleDefaultTitleInputEl, titleDynamicEnabledCheckboxEl } from "src/options/scripts/ui";

export const fillTitleInputs = (config: Config) => {
  titleDefaultTitleInputEl.value = config.title.defaultTitle;
  titleDynamicEnabledCheckboxEl.checked = config.title.dynamic.enabled;
};
