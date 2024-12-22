import { Config } from "src/utils/config";
import { optionsShowOptionsButtonCheckboxEl } from "src/options/scripts/ui";

export const saveOptionsSettingsToDraft = (draft: Config) => {
  draft.options.showOptionsButton = optionsShowOptionsButtonCheckboxEl.checked;
};
