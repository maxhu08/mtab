import { Config, FontType, SearchEngine } from "src/newtab/scripts/config";
import {
  searchEnabledCheckboxEl,
  searchFocusedBorderColorInputEl,
  searchPlaceholderTextColorInputEl,
  searchPlaceholderTextInputEl,
  searchTextColorInputEl,
  searchUseCustomEngineEnabledCheckboxEl,
  searchCustomEngineURLInputEl,
  searchBookmarkPlaceholderTextInputEl,
  searchSearchIconColorInputEl,
  searchBookmarkIconColorInputEl,
  searchSelectIconColorInputEl,
  // searchAssistHistoryCheckboxEl,
  searchAssistDateCheckboxEl,
  searchAssistMathCheckboxEl,
  searchAssistDefinitionsCheckboxEl,
  searchAssistConversionsCheckboxEl,
  searchFontCustomInputEl
} from "src/options/scripts/ui";

export const saveSearchSettingsToDraft = (draft: Config) => {
  draft.search.enabled = searchEnabledCheckboxEl.checked;

  // prettier-ignore
  const selectedFontTypeEl = document.querySelector(`button[btn-option-type="search-font-type"][selected="yes"]`) as HTMLButtonElement;
  const searchFontTypePairs: Record<string, FontType> = {
    "search-font-type-default-button": "default",
    "search-font-type-custom-button": "custom"
  };
  draft.search.font.type = searchFontTypePairs[selectedFontTypeEl.id];
  draft.search.font.custom = searchFontCustomInputEl.value;

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

  // draft.search.assist.history = searchAssistHistoryCheckboxEl.checked;
  draft.search.assist.date = searchAssistDateCheckboxEl.checked;
  draft.search.assist.math = searchAssistMathCheckboxEl.checked;
  draft.search.assist.definitions = searchAssistDefinitionsCheckboxEl.checked;
  draft.search.assist.conversions = searchAssistConversionsCheckboxEl.checked;
};
