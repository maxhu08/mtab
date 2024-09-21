import { Config } from "src/newtab/scripts/config";
import { searchInputEl } from "src/newtab/scripts/ui";
import { hideAssist, displayAssist } from "src/newtab/scripts/utils/assistant-utils";
import { evaluate, isNumber } from "mathjs";

export const listenToSearch = (config: Config) => {
  // chrome.history.search(
  //   {
  //     text: "",
  //     maxResults: 1
  //   },
  //   (history) => {
  //     searchInputEl.oninput = () => {
  //       const val = searchInputEl.value;
  //       if (val === "") {
  //         hideAssist();
  //       } else {
  //         handleHistory(val, history, config);
  //         handleDate(val, config);
  //         handleMath(val, config);
  //         handleDefinition(val, config);
  //       }
  //     };
  //   }
  // );

  searchInputEl.oninput = () => {
    const val = searchInputEl.value;
    if (val === "") {
      hideAssist();
    } else {
      handleDate(val, config);
      handleMath(val, config);
      handleDefinition(val, config);
    }
  };
};

const handleHistory = (val: string, history: chrome.history.HistoryItem[], config: Config) => {
  const matchingItems = history
    .filter((h) => h.title?.toLocaleLowerCase().startsWith(val.toLowerCase()))
    .slice(0, 6);

  if (matchingItems.length > 0) {
    displayAssist([{ type: "history", historyItems: matchingItems }], config);
  } else hideAssist();
};

const handleDate = (val: string, config: Config) => {
  if (val === "date") displayAssist([{ type: "date" }], config);
};

const handleMath = (val: string, config: Config) => {
  try {
    const result = evaluate(val);
    if (isNumber(result)) {
      displayAssist([{ type: "math", result: result.toString() }], config);
    }
  } catch {
    if (val !== "date") hideAssist();
  }
};

const handleDefinition = async (val: string, config: Config) => {
  if (val.endsWith(" def") || val.endsWith(" definition")) {
    const word = val.replace(/ def$/, "").replace(/ definition$/, "");

    try {
      // prettier-ignore
      const response = await fetch(`https://raw.githubusercontent.com/open-dictionary/english-dictionary/master/${word[0]}/${word[1]}/${word}/en.json`);
      // const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      const data = await response.json();
      displayAssist([{ type: "definition", result: data }], config);
    } catch {}
  }
};
