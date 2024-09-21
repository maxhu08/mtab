import { Config } from "src/newtab/scripts/config";
import { searchInputEl } from "src/newtab/scripts/ui";
import { hideAssist, displayAssist } from "src/newtab/scripts/utils/assistant-utils";
import { evaluate, isNumber } from "mathjs";

export const listenToSearch = (config: Config) => {
  chrome.history.search(
    {
      text: "",
      maxResults: 1000
    },
    (history) => {
      console.log(history);

      searchInputEl.oninput = () => {
        const val = searchInputEl.value;

        if (val === "") {
          hideAssist();
        } else {
          handleHistory(val, history, config);
          handleDate(val, config);
          handleMath(val, config);
        }
      };
    }
  );
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
      console.log(result);
      displayAssist([{ type: "math", result: result.toString() }], config);
    }
  } catch {}
};
