import { Config } from "src/newtab/scripts/config";
import { dynamicTitleEnabledCheckboxEl, titleInputEl } from "src/options/scripts/ui";

export const fillTitleInputs = (config: Config) => {
  titleInputEl.value = config.title;
  dynamicTitleEnabledCheckboxEl.checked = config.dynamicTitle.enabled;
};
