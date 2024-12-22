import { Config } from "src/utils/config";
import {
  hotkeysEnabledCheckboxEl,
  hotkeysActivationKeyInputEl,
  hotkeysClosePageKeyInputEl,
  hotkeysSearchBookmarksKeyInputEl,
  hotkeysActivationKeyStatusEl,
  hotkeysClosePageKeyStatusEl,
  hotkeysSearchBookmarksKeyStatusEl
} from "src/options/scripts/ui";

export const fillHotkeysInputs = (config: Config) => {
  hotkeysEnabledCheckboxEl.checked = config.hotkeys.enabled;

  fillHotkeyHelper(
    hotkeysActivationKeyInputEl,
    hotkeysActivationKeyStatusEl,
    config.hotkeys.activationKey
  );
  fillHotkeyHelper(
    hotkeysClosePageKeyInputEl,
    hotkeysClosePageKeyStatusEl,
    config.hotkeys.closePageKey
  );
  fillHotkeyHelper(
    hotkeysSearchBookmarksKeyInputEl,
    hotkeysSearchBookmarksKeyStatusEl,
    config.hotkeys.searchBookmarksKey
  );
};

const fillHotkeyHelper = (input: HTMLInputElement, status: HTMLSpanElement, val: string) => {
  input.value = val;

  if (val === "") status.textContent = ` (none)`;
  else if (val === " ") status.textContent = ` (Space)`;
  else status.textContent = ` (${val})`;
};
