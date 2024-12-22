import { Config } from "src/utils/config";
import {
  hotkeysEnabledCheckboxEl,
  hotkeysActivationKeyInputEl,
  hotkeysClosePageKeyInputEl,
  hotkeysSearchBookmarksKeyInputEl
} from "src/options/scripts/ui";

export const saveHotkeysSettingsToDraft = (draft: Config) => {
  draft.hotkeys.enabled = hotkeysEnabledCheckboxEl.checked;

  draft.hotkeys.activationKey = hotkeysActivationKeyInputEl.value;
  draft.hotkeys.closePageKey = hotkeysClosePageKeyInputEl.value;
  draft.hotkeys.searchBookmarksKey = hotkeysSearchBookmarksKeyInputEl.value;
};
