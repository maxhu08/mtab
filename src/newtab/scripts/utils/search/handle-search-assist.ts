import { Config } from "src/utils/config";
import { searchInputEl } from "src/newtab/scripts/ui";
import { handleConversion } from "src/newtab/scripts/utils/search/handle-conversion";
import { handleDate } from "src/newtab/scripts/utils/search/handle-date";
import { handleDefinition } from "src/newtab/scripts/utils/search/handle-definition";
import { handleMath } from "src/newtab/scripts/utils/search/handle-math";
import {
  AssistItem,
  displayAssist,
  hideAssist
} from "src/newtab/scripts/utils/search/search-assist-utils";

export const handleSearchAssist = (
  config: Config
  // history: chrome.history.HistoryItem[] = []
) => {
  searchInputEl.oninput = async () => {
    const val = searchInputEl.value;
    if (val === "") {
      hideAssist();
    } else {
      let assistItems: AssistItem[] = [];

      if (config.search.assist.date) {
        const dateResult = handleDate(val);
        dateResult !== undefined && assistItems.push(dateResult);
      }
      if (config.search.assist.math) {
        const mathResult = handleMath(val);
        mathResult !== undefined && assistItems.push(mathResult);
      }
      if (config.search.assist.definitions) {
        const definitionResult = await handleDefinition(val);
        definitionResult !== undefined && assistItems.push(definitionResult);
      }
      if (config.search.assist.conversions) {
        const conversionResult = handleConversion(val);
        conversionResult !== undefined && assistItems.push(conversionResult);
      }
      // if (config.search.assist.history) {
      //   const historyResult = handleHistory(val, history);
      //   historyResult !== undefined && assistItems.push(historyResult);
      // }

      if (assistItems.length > 0) displayAssist(assistItems, config);
      else hideAssist();
    }
  };
};
