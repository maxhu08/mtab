import { Config } from "src/newtab/scripts/config";
import { dynamicTitleEnabledCheckbox } from "src/options/scripts/ui";

export const saveDynamicTitleToDraft = (draft: Config) => {
  draft.dynamicTitle.enabled = dynamicTitleEnabledCheckbox.checked;
};
