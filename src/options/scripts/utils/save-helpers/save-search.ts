import { Config } from "src/newtab/scripts/config";
import { searchFontInputEl, searchPlaceholderTextInputEl } from "src/options/scripts/ui";

export const saveSearchSettingsToDraft = (draft: Config) => {
  draft.search.font = searchFontInputEl.value;
  draft.search.placeholderText = searchPlaceholderTextInputEl.value;
};
