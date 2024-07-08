import { Config } from "src/newtab/scripts/config";
import {
  searchFocusedBorderColorInputEl,
  searchFontInputEl,
  searchPlaceholderTextInputEl,
  searchTextColorInputEl
} from "src/options/scripts/ui";

export const saveSearchSettingsToDraft = (draft: Config) => {
  draft.search.font = searchFontInputEl.value;
  draft.search.placeholderText = searchPlaceholderTextInputEl.value;
  draft.search.textColor = searchTextColorInputEl.value;

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
    case "search-engine-brave-button": {
      draft.search.engine = "brave";
      break;
    }
    case "search-engine-yahoo-button": {
      draft.search.engine = "yahoo";
      break;
    }
    case "search-engine-yandex-button": {
      draft.search.engine = "yandex";
      break;
    }
    case "search-engine-startpage-button": {
      draft.search.engine = "startpage";
      break;
    }
    case "search-engine-ecosia-button": {
      draft.search.engine = "ecosia";
      break;
    }
  }

  draft.search.focusedBorderColor = searchFocusedBorderColorInputEl.value;
};
