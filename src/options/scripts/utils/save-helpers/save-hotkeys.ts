import { Config } from "src/newtab/scripts/config";
import { hotkeysEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveHotkeysSettingsToDraft = (draft: Config) => {
  draft.hotkeys.enabled = hotkeysEnabledCheckboxEl.checked;
};
