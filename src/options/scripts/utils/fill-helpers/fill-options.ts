import { Config } from "src/utils/config";
import { optionsShowOptionsButtonCheckboxEl } from "src/options/scripts/ui";

export const fillOptionsInputs = (config: Config) => {
  optionsShowOptionsButtonCheckboxEl.checked = config.options.showOptionsButton;
};
