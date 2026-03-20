import { Config } from "~/src/utils/config";
import { searchInputEl } from "~/src/newtab/scripts/ui";
import { handleConversion } from "~/src/newtab/scripts/utils/search/handle-conversion";
import { handleDate } from "~/src/newtab/scripts/utils/search/handle-date";
import { handleDefinition } from "~/src/newtab/scripts/utils/search/handle-definition";
import { handleMath } from "~/src/newtab/scripts/utils/search/handle-math";
import {
  AssistItem,
  displayAssist,
  hideAssist
} from "~/src/newtab/scripts/utils/search/search-assist-utils";
import { handleSearchSuggestions } from "~/src/newtab/scripts/utils/search/handle-search-suggestions";
import { openUrl, search } from "~/src/newtab/scripts/utils/search";
import { recognizeUrl } from "~/src/newtab/scripts/utils/search/recognize-url";
import { handlePasswordGenerator } from "~/src/newtab/scripts/utils/search/handle-password-generator";
import { handleConversionCurrency } from "~/src/newtab/scripts/utils/search/handle-conversion-currency";

export const handleSearchAssist = (config: Config) => {
  if (config.search.suggestions) {
    handleSearchSuggestions(config.search.recognizeLinks, {
      inputEl: searchInputEl,
      textColor: config.search.textColor,
      placeholderTextColor: config.search.placeholderTextColor,
      linkTextColor: config.search.linkTextColor,
      recognizeLinks: config.search.recognizeLinks,
      resultUrlAttr: "search-result-url",
      onOpen: (value, openInNewTab) => {
        const direct = config.search.recognizeLinks ? recognizeUrl(value) : null;

        if (direct) {
          openUrl(config, direct, openInNewTab);
          return;
        }

        search(config, value, openInNewTab);
      }
    });
  }

  let assistRunId = 0;

  searchInputEl.addEventListener("input", async () => {
    const currentRunId = ++assistRunId;
    const val = searchInputEl.value;

    if (val === "") {
      hideAssist();
      return;
    }

    const assistItems: AssistItem[] = [];

    if (config.search.assist.date) {
      const dateResult = handleDate(val);
      if (dateResult) assistItems.push(dateResult);
    }

    if (config.search.assist.math) {
      const mathResult = await handleMath(val);
      if (currentRunId !== assistRunId) return;
      if (mathResult) assistItems.push(mathResult);
    }

    if (config.search.assist.definitions) {
      const definitionResult = await handleDefinition(val);
      if (currentRunId !== assistRunId) return;
      if (definitionResult) assistItems.push(definitionResult);
    }

    if (config.search.assist.conversions) {
      const conversionResult = handleConversion(val);
      if (conversionResult) assistItems.push(conversionResult);

      const conversionCurrencyResult = await handleConversionCurrency(val);
      if (currentRunId !== assistRunId) return;
      if (conversionCurrencyResult) assistItems.push(conversionCurrencyResult);
    }

    if (config.search.assist.passwordGenerator) {
      const passwordGeneratorResult = handlePasswordGenerator(val);
      if (passwordGeneratorResult) assistItems.push(passwordGeneratorResult);
    }

    if (assistItems.length > 0) displayAssist(assistItems, config);
    else hideAssist();
  });
};