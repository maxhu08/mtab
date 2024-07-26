import { Config, SearchEngine } from "src/newtab/scripts/config";
import {
  searchEnabledCheckboxEl,
  searchFocusedBorderColorInputEl,
  searchFontInputEl,
  searchPlaceholderTextColorInputEl,
  searchPlaceholderTextInputEl,
  searchTextColorInputEl,
  searchUseCustomEngineEnabledCheckboxEl,
  searchCustomEngineURLInputEl,
  searchBookmarkPlaceholderTextInputEl,
  searchSearchIconColorInputEl,
  searchBookmarkIconColorInputEl,
  searchSelectIconColorInputEl
} from "src/options/scripts/ui";

export const saveSearchSettingsToDraft = (draft: Config) => {
  draft.search.enabled = searchEnabledCheckboxEl.checked;
  draft.search.font = searchFontInputEl.value;
  draft.search.textColor = searchTextColorInputEl.value;
  draft.search.placeholderText = searchPlaceholderTextInputEl.value;
  draft.search.bookmarkPlaceholderText = searchBookmarkPlaceholderTextInputEl.value;
  draft.search.placeholderTextColor = searchPlaceholderTextColorInputEl.value;
  draft.search.bookmarkIconColor = searchBookmarkPlaceholderTextInputEl.value;

  draft.search.searchIconColor = searchSearchIconColorInputEl.value;
  draft.search.bookmarkIconColor = searchBookmarkIconColorInputEl.value;
  draft.search.selectIconColor = searchSelectIconColorInputEl.value;

  draft.search.useCustomEngine = searchUseCustomEngineEnabledCheckboxEl.checked;
  draft.search.customEngineURL = searchCustomEngineURLInputEl.value;

  if (!searchUseCustomEngineEnabledCheckboxEl.checked) {
    const selectedEl = document.querySelector(
      `button[btn-option-type="search-engine"][selected="yes"]`
    ) as HTMLButtonElement;

    const searchEnginePairs: Record<string, SearchEngine> = {
      "search-engine-duckduckgo-button": "duckduckgo",
      "search-engine-google-button": "google",
      "search-engine-bing-button": "bing",
      "search-engine-brave-button": "brave",
      "search-engine-yahoo-button": "yahoo",
      "search-engine-yandex-button": "yandex",
      "search-engine-startpage-button": "startpage",
      "search-engine-ecosia-button": "ecosia"
    };

    draft.search.engine = searchEnginePairs[selectedEl.id];
  }

  draft.search.focusedBorderColor = searchFocusedBorderColorInputEl.value;
};
