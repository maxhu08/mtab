import { Config } from "src/newtab/scripts/config";
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

  if (!config.search.useCustomEngine) {
    switch (config.search.engine) {
      case "duckduckgo": {
        searchEngineDuckduckgoButtonEl.click();
        break;
      }
      case "google": {
        searchEngineGoogleButtonEl.click();
        break;
      }
      case "bing": {
        searchEngineBingButtonEl.click();
        break;
      }
      case "brave": {
        searchEngineBraveButtonEl.click();
        break;
      }
      case "yahoo": {
        searchEngineYahooButtonEl.click();
        break;
      }
      case "yandex": {
        searchEngineYandexButtonEl.click();
        break;
      }
      case "startpage": {
        searchEngineStartpageButtonEl.click();
        break;
      }
      case "ecosia": {
        searchEngineEcosiaButtonEl.click();
        break;
      }
    }
  }

  searchFocusedBorderColorInputEl.value = config.search.focusedBorderColor;
  searchEnabledCheckboxEl.checked = config.search.enabled;

  searchUseCustomEngineEnabledCheckboxEl.checked = config.search.useCustomEngine;
  searchCustomEngineURLInputEl.value = config.search.customEngineURL;
};
