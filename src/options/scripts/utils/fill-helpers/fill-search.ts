import { Config, SearchEngine } from "src/newtab/scripts/config";
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
  searchFontInputEl,
  searchPlaceholderTextInputEl,
  searchTextColorInputEl,
  searchPlaceholderTextColorInputEl,
  searchEnabledCheckboxEl,
  searchUseCustomEngineEnabledCheckboxEl,
  searchCustomEngineURLInputEl,
  searchBookmarkPlaceholderTextInputEl,
  searchSearchIconColorInputEl,
  searchBookmarkIconColorInputEl,
  searchSelectIconColorInputEl
} from "src/options/scripts/ui";

export const fillSearchInputs = (config: Config) => {
  searchFontInputEl.value = config.search.font;
  searchTextColorInputEl.value = config.search.textColor;
  searchPlaceholderTextInputEl.value = config.search.placeholderText;
  searchBookmarkPlaceholderTextInputEl.value = config.search.bookmarkPlaceholderText;
  searchPlaceholderTextColorInputEl.value = config.search.placeholderTextColor;
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
    ecosia: searchEngineEcosiaButtonEl
  };

  if (!config.search.useCustomEngine) {
    searchEnginePairs[config.search.engine].click();
  }

  searchFocusedBorderColorInputEl.value = config.search.focusedBorderColor;
  searchEnabledCheckboxEl.checked = config.search.enabled;

  searchUseCustomEngineEnabledCheckboxEl.checked = config.search.useCustomEngine;
  searchCustomEngineURLInputEl.value = config.search.customEngineURL;
};
