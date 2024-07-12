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
  searchCustomEnabledCheckboxEl,
  searchCustomEngineInputEl
} from "src/options/scripts/ui";

export const fillSearchInputs = (config: Config) => {
  searchFontInputEl.value = config.search.font;
  searchTextColorInputEl.value = config.search.textColor;
  searchPlaceholderTextInputEl.value = config.search.placeholderText;
  searchPlaceholderTextColorInputEl.value = config.search.placeholderTextColor;

  if (!config.search.usingCustomSearchEngine) {
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

  searchCustomEnabledCheckboxEl.checked = config.search.usingCustomSearchEngine;
  searchCustomEngineInputEl.value = config.search.customSearchEngineURL;
};
