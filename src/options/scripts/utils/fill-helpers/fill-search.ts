import { Config, FontType, SearchEngine } from "src/utils/config";
import {
  searchEngineDuckduckgoButtonEl,
  searchEngineBingButtonEl,
  searchEngineBraveButtonEl,
  searchEngineGoogleButtonEl,
  searchEngineYahooButtonEl,
  searchEngineYandexButtonEl,
  searchEngineStartpageButtonEl,
  searchEngineEcosiaButtonEl,
  searchFocusedBorderColorInputEl,
  searchPlaceholderTextInputEl,
  searchTextColorInputEl,
  searchPlaceholderTextColorInputEl,
  searchEnabledCheckboxEl,
  searchUseCustomEngineCheckboxEl,
  searchCustomEngineURLInputEl,
  searchBookmarkPlaceholderTextInputEl,
  searchSearchIconColorInputEl,
  searchBookmarkIconColorInputEl,
  searchSelectIconColorInputEl,
  searchRecognizeLinksCheckboxEl,
  searchLinkTextColorInputEl,
  searchSuggestionsCheckboxEl,
  searchAssistDateCheckboxEl,
  searchAssistMathCheckboxEl,
  searchAssistDefinitionsCheckboxEl,
  searchAssistConversionsCheckboxEl,
  searchFontCustomInputEl,
  searchFontTypeDefaultButtonEl,
  searchFontTypeCustomButtonEl,
  searchEngineKagiButtonEl
} from "src/options/scripts/ui";

export const fillSearchInputs = (config: Config) => {
  searchEnabledCheckboxEl.checked = config.search.enabled;
  searchFocusedBorderColorInputEl.value = config.search.focusedBorderColor;

  const searchFontTypePairs: Record<FontType, HTMLButtonElement> = {
    default: searchFontTypeDefaultButtonEl,
    custom: searchFontTypeCustomButtonEl
  };
  searchFontTypePairs[config.search.font.type].click();
  searchFontCustomInputEl.value = config.search.font.custom;

  searchTextColorInputEl.value = config.search.textColor;
  searchPlaceholderTextInputEl.value = config.search.placeholderText;
  searchBookmarkPlaceholderTextInputEl.value = config.search.bookmarkPlaceholderText;
  searchPlaceholderTextColorInputEl.value = config.search.placeholderTextColor;

  searchLinkTextColorInputEl.value = config.search.linkTextColor;

  searchSearchIconColorInputEl.value = config.search.searchIconColor;
  searchBookmarkIconColorInputEl.value = config.search.bookmarkIconColor;
  searchSelectIconColorInputEl.value = config.search.selectIconColor;

  const searchEnginePairs: Record<SearchEngine, HTMLButtonElement> = {
    duckduckgo: searchEngineDuckduckgoButtonEl,
    google: searchEngineGoogleButtonEl,
    bing: searchEngineBingButtonEl,
    brave: searchEngineBraveButtonEl,
    yahoo: searchEngineYahooButtonEl,
    yandex: searchEngineYandexButtonEl,
    startpage: searchEngineStartpageButtonEl,
    ecosia: searchEngineEcosiaButtonEl,
    kagi: searchEngineKagiButtonEl
  };

  if (!config.search.useCustomEngine) {
    searchEnginePairs[config.search.engine].click();
  }

  searchUseCustomEngineCheckboxEl.checked = config.search.useCustomEngine;
  searchCustomEngineURLInputEl.value = config.search.customEngineURL;

  searchRecognizeLinksCheckboxEl.checked = config.search.recognizeLinks;
  searchSuggestionsCheckboxEl.checked = config.search.suggestions;

  searchAssistDateCheckboxEl.checked = config.search.assist.date;
  searchAssistMathCheckboxEl.checked = config.search.assist.math;
  searchAssistDefinitionsCheckboxEl.checked = config.search.assist.definitions;
  searchAssistConversionsCheckboxEl.checked = config.search.assist.conversions;
};
