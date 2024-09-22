import { Config } from "src/newtab/scripts/config";
import { searchInputEl } from "src/newtab/scripts/ui";
import { hideAssist, displayAssist, AssistItem } from "src/newtab/scripts/utils/assistant-utils";
import { evaluate, isNumber } from "mathjs";

export const listenToSearch = (config: Config) => {
  if (config.search.assist.history) {
    chrome.history.search(
      {
        text: "",
        maxResults: 100
      },
      (history) => {
        handleSearch(config, history);
      }
    );
  } else handleSearch(config);
};

const handleSearch = (config: Config, history: chrome.history.HistoryItem[] = []) => {
  searchInputEl.oninput = async () => {
    const val = searchInputEl.value;
    if (val === "") {
      hideAssist();
    } else {
      let assistItems: AssistItem[] = [];

      if (config.search.assist.date) assistItems = handleDate(val, assistItems);
      if (config.search.assist.math) assistItems = handleMath(val, assistItems);
      if (config.search.assist.definitions) assistItems = await handleDefinition(val, assistItems);
      if (config.search.assist.history) assistItems = handleHistory(val, history, assistItems);

      console.log(assistItems);
      if (assistItems.length > 0) displayAssist(assistItems, config);
      else hideAssist();
    }
  };
};

const handleHistory = (
  val: string,
  history: chrome.history.HistoryItem[],
  assistItems: AssistItem[]
) => {
  const matchingItems = history
    .filter((h) => h.title?.toLocaleLowerCase().startsWith(val.toLowerCase()))
    .slice(0, 6);

  if (matchingItems.length > 0) {
    assistItems.push({ type: "history", historyItems: matchingItems });
  } else hideAssist();

  return assistItems;
};

const handleDate = (val: string, assistItems: AssistItem[]) => {
  if (val === "date") {
    assistItems.push({ type: "date" });
  }

  return assistItems;
};

const handleMath = (val: string, assistItems: AssistItem[]) => {
  try {
    const result = evaluate(val);
    if (isNumber(result)) {
      assistItems.push({ type: "math", result: result.toString() });
    }
  } catch {
    if (val !== "date") hideAssist();
  }

  return assistItems;
};

const handleDefinition = async (val: string, assistItems: AssistItem[]) => {
  if (val.endsWith(" def") || val.endsWith(" definition")) {
    const word = val.replace(/ def$/, "").replace(/ definition$/, "");

    try {
      // prettier-ignore
      const response = await fetch(`https://raw.githubusercontent.com/open-dictionary/english-dictionary/master/${word[0]}/${word[1]}/${word}/en.json`);
      // const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      const data = await response.json();
      assistItems.push({ type: "definition", result: data });
    } catch {}
  }

  return assistItems;
};
