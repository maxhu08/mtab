import { Config } from "src/newtab/scripts/config";
import { hotkeysEnabledCheckboxEl } from "src/options/scripts/ui";

export const fillHotkeysInputs = (config: Config) => {
  hotkeysEnabledCheckboxEl.checked = config.hotkeys.enabled;
};
