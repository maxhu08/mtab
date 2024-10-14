import { Config } from "src/newtab/scripts/config";
import { optionsShowOptionsButtonCheckboxEl } from "src/options/scripts/ui";

export const fillOptionsInputs = (config: Config) => {
  optionsShowOptionsButtonCheckboxEl.checked = config.options.showOptionsButton;
};
