import { Config, FontType, SearchEngine } from "src/utils/config";
import {
  searchEnabledCheckboxEl,
  searchEngineDuckduckgoButtonEl,
  searchEngineGoogleButtonEl,
  searchEngineBingButtonEl,
  searchEngineBraveButtonEl,
  searchEngineYahooButtonEl,
  searchEngineYandexButtonEl,
  searchEngineStartpageButtonEl,
  searchEngineEcosiaButtonEl,
  searchEngineKagiButtonEl,
  searchUseCustomEngineCheckboxEl,
  searchCustomEngineURLInputEl,
  searchButtonsClearCheckboxEl,
  searchButtonsSearchCheckboxEl,
  searchRecognizeLinksCheckboxEl,
  searchSuggestionsCheckboxEl,
  searchAssistDateCheckboxEl,
  searchAssistMathCheckboxEl,
  searchAssistDefinitionsCheckboxEl,
  searchAssistConversionsCheckboxEl,
  searchAssistPasswordGeneratorCheckboxEl,
  searchPlaceholderTextInputEl,
  searchBookmarkPlaceholderTextInputEl,
  searchFocusedBorderColorInputEl,
  searchFontTypeDefaultButtonEl,
  searchFontTypeCustomButtonEl,
  searchFontCustomInputEl,
  searchTextColorInputEl,
  searchPlaceholderTextColorInputEl,
  searchSearchIconColorInputEl,
  searchBookmarkIconColorInputEl,
  searchSelectIconColorInputEl,
  searchLinkTextColorInputEl
} from "src/options/scripts/ui";

export const fillSearchInputs = (config: Config) => {
  searchEnabledCheckboxEl.checked = config.search.enabled;

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

  searchButtonsClearCheckboxEl.checked = config.search.buttons.clear;
  searchButtonsSearchCheckboxEl.checked = config.search.buttons.search;
  searchRecognizeLinksCheckboxEl.checked = config.search.recognizeLinks;
  searchSuggestionsCheckboxEl.checked = config.search.suggestions;

  searchAssistDateCheckboxEl.checked = config.search.assist.date;
  searchAssistMathCheckboxEl.checked = config.search.assist.math;
  searchAssistDefinitionsCheckboxEl.checked = config.search.assist.definitions;
  searchAssistConversionsCheckboxEl.checked = config.search.assist.conversions;
  searchAssistPasswordGeneratorCheckboxEl.checked = config.search.assist.passwordGenerator;

  searchPlaceholderTextInputEl.value = config.search.placeholderText;
  searchBookmarkPlaceholderTextInputEl.value = config.search.bookmarkPlaceholderText;
  searchFocusedBorderColorInputEl.value = config.search.focusedBorderColor;

  const searchFontTypePairs: Record<FontType, HTMLButtonElement> = {
    default: searchFontTypeDefaultButtonEl,
    custom: searchFontTypeCustomButtonEl
  };
  searchFontTypePairs[config.search.font.type].click();
  searchFontCustomInputEl.value = config.search.font.custom;

  searchTextColorInputEl.value = config.search.textColor;
  searchPlaceholderTextColorInputEl.value = config.search.placeholderTextColor;
  searchSearchIconColorInputEl.value = config.search.searchIconColor;
  searchBookmarkIconColorInputEl.value = config.search.bookmarkIconColor;
  searchSelectIconColorInputEl.value = config.search.selectIconColor;
  searchLinkTextColorInputEl.value = config.search.linkTextColor;
};
