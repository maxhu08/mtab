import { Config, FontType, SearchEngine } from "src/utils/config";
import {
  searchEnabledCheckboxEl,
  searchFocusedBorderColorInputEl,
  searchPlaceholderTextColorInputEl,
  searchPlaceholderTextInputEl,
  searchTextColorInputEl,
  searchUseCustomEngineCheckboxEl,
  searchCustomEngineURLInputEl,
  searchBookmarkPlaceholderTextInputEl,
  searchSearchIconColorInputEl,
  searchBookmarkIconColorInputEl,
  searchSelectIconColorInputEl,
  searchAssistDateCheckboxEl,
  searchAssistMathCheckboxEl,
  searchAssistDefinitionsCheckboxEl,
  searchAssistConversionsCheckboxEl,
  searchFontCustomInputEl,
  searchRecognizeLinksCheckboxEl,
  searchLinkTextColorInputEl,
  searchSuggestionsCheckboxEl
} from "src/options/scripts/ui";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";

export const saveSearchSettingsToDraft = (draft: Config) => {
  draft.search.enabled = searchEnabledCheckboxEl.checked;

  const selectedFontTypeEl = getSelectedButton("search-font-type");
  const searchFontTypePairs: Record<string, FontType> = {
    "search-font-type-default-button": "default",
    "search-font-type-custom-button": "custom"
  };
  if (selectedFontTypeEl) {
    draft.search.font.type = searchFontTypePairs[selectedFontTypeEl.id];
  }
  draft.search.font.custom = searchFontCustomInputEl.value;

  draft.search.textColor = searchTextColorInputEl.value;
  draft.search.placeholderText = searchPlaceholderTextInputEl.value;
  draft.search.bookmarkPlaceholderText = searchBookmarkPlaceholderTextInputEl.value;
  draft.search.placeholderTextColor = searchPlaceholderTextColorInputEl.value;

  draft.search.linkTextColor = searchLinkTextColorInputEl.value;

  draft.search.searchIconColor = searchSearchIconColorInputEl.value;
  draft.search.bookmarkIconColor = searchBookmarkIconColorInputEl.value;
  draft.search.selectIconColor = searchSelectIconColorInputEl.value;

  draft.search.recognizeLinks = searchRecognizeLinksCheckboxEl.checked;
  draft.search.suggestions = searchSuggestionsCheckboxEl.checked;

  draft.search.useCustomEngine = searchUseCustomEngineCheckboxEl.checked;
  draft.search.customEngineURL = searchCustomEngineURLInputEl.value;

  if (!searchUseCustomEngineCheckboxEl.checked) {
    const selectedEl = getSelectedButton("search-engine");

    const searchEnginePairs: Record<string, SearchEngine> = {
      "search-engine-duckduckgo-button": "duckduckgo",
      "search-engine-google-button": "google",
      "search-engine-bing-button": "bing",
      "search-engine-brave-button": "brave",
      "search-engine-yahoo-button": "yahoo",
      "search-engine-yandex-button": "yandex",
      "search-engine-startpage-button": "startpage",
      "search-engine-ecosia-button": "ecosia",
      "search-engine-kagi-button": "kagi"
    };

    if (selectedEl) {
      draft.search.engine = searchEnginePairs[selectedEl.id];
    }
  }

  draft.search.focusedBorderColor = searchFocusedBorderColorInputEl.value;

  draft.search.assist.date = searchAssistDateCheckboxEl.checked;
  draft.search.assist.math = searchAssistMathCheckboxEl.checked;
  draft.search.assist.definitions = searchAssistDefinitionsCheckboxEl.checked;
  draft.search.assist.conversions = searchAssistConversionsCheckboxEl.checked;
};
