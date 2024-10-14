import { Config } from "src/newtab/scripts/config";
import { optionsShowOptionsButtonCheckboxEl } from "src/options/scripts/ui";

export const saveOptionsSettingsToDraft = (draft: Config) => {
  draft.options.showOptionsButton = optionsShowOptionsButtonCheckboxEl.checked;
};
