import { Config } from "src/newtab/scripts/config";
import { dynamicTitleEnabledCheckboxEl, titleInputEl } from "src/options/scripts/ui";

export const saveTitleSettingsToDraft = (draft: Config) => {
  draft.title = titleInputEl.value;
  draft.dynamicTitle.enabled = dynamicTitleEnabledCheckboxEl.checked;
};
