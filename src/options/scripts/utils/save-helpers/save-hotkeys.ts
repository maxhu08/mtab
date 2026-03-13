import { Config } from "~/src/utils/config";
import { normalizeStoredHotkey } from "~/src/utils/hotkeys";
import {
  hotkeysEnabledCheckboxEl,
  hotkeysActivationKeyInputEl,
  hotkeysClosePageKeyInputEl,
  hotkeysSearchBookmarksKeyInputEl
} from "~/src/options/scripts/ui";

export const saveHotkeysSettingsToDraft = (draft: Config) => {
  draft.hotkeys.enabled = hotkeysEnabledCheckboxEl.checked;

  draft.hotkeys.activationKey = normalizeStoredHotkey(hotkeysActivationKeyInputEl.value);
  draft.hotkeys.closePageKey = normalizeStoredHotkey(hotkeysClosePageKeyInputEl.value);
  draft.hotkeys.searchBookmarksKey = normalizeStoredHotkey(hotkeysSearchBookmarksKeyInputEl.value);
};