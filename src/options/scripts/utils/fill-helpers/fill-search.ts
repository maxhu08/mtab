import { Config } from "src/newtab/scripts/config";
import { searchFontInputEl, searchPlaceholderTextInputEl } from "src/options/scripts/ui";

export const fillSearchInputs = (config: Config) => {
  searchFontInputEl.value = config.search.font;
  searchPlaceholderTextInputEl.value = config.search.placeholderText;
};
