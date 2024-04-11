import { Config } from "src/newtab/scripts/config";
import {
  searchEngineDuckduckgoButtonEl,
  searchEngineBingButtonEl,
  searchEngineBraveButtonEl,
  searchEngineGoogleButtonEl,
  searchEngineYahooButtonEl,
  searchEngineYandexButtonEl,
  searchFocusedBorderColorInputEl,
  searchFontInputEl,
  searchPlaceholderTextInputEl
} from "src/options/scripts/ui";

export const fillSearchInputs = (config: Config) => {
  searchFontInputEl.value = config.search.font;
  searchPlaceholderTextInputEl.value = config.search.placeholderText;

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
  }

  searchFocusedBorderColorInputEl.value = config.search.focusedBorderColor;
};
