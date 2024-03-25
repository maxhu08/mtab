import { Config } from "src/newtab/scripts/config";
import { titleDefaultTitleInputEl, titleDynamicEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveTitleSettingsToDraft = (draft: Config) => {
  draft.title.defaultTitle = titleDefaultTitleInputEl.value;
  draft.title.dynamic.enabled = titleDynamicEnabledCheckboxEl.checked;
};
