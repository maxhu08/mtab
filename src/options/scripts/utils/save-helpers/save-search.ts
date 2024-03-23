import { Config } from "src/newtab/scripts/config";
import {
  searchFocusedBorderColorInputEl,
  searchFontInputEl,
  searchPlaceholderTextInputEl
} from "src/options/scripts/ui";

export const saveSearchSettingsToDraft = (draft: Config) => {
  draft.search.font = searchFontInputEl.value;
  draft.search.placeholderText = searchPlaceholderTextInputEl.value;

  const selectedEl = document.querySelector(
    `button[btn-option-type="search-engine"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedEl.id) {
    case "search-engine-duckduckgo-button": {
      draft.search.engine = "duckduckgo";
      break;
    }
    case "search-engine-google-button": {
      draft.search.engine = "google";
      break;
    }
    case "search-engine-bing-button": {
      draft.search.engine = "bing";
      break;
    }
    case "search-engine-yahoo-button": {
      draft.search.engine = "yahoo";
      break;
    }
  }

  draft.search.focusedBorderColor = searchFocusedBorderColorInputEl.value;
};
