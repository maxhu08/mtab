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
        const uniqueHistoryMap: Record<string, (typeof history)[number]> = {};
        for (const h of history) {
          if (h.title && !uniqueHistoryMap[h.title]) {
            uniqueHistoryMap[h.title] = h;
          }
        }
        const uniqueHistory = Object.values(uniqueHistoryMap);

        handleSearch(config, uniqueHistory);
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
      if (true) {
        const conversionResult = handleConversion(val);
        conversionResult !== undefined && assistItems.push(conversionResult);
      }
      if (config.search.assist.history) {
        const historyResult = handleHistory(val, history);
        historyResult !== undefined && assistItems.push(historyResult);
      }

      if (assistItems.length > 0) displayAssist(assistItems, config);
      else hideAssist();
    }
  };
};

const handleHistory = (val: string, history: chrome.history.HistoryItem[]) => {
  const matchingItems = history
    .filter((h) => h.title?.toLocaleLowerCase().startsWith(val.toLowerCase()))
    .slice(0, 6);

  if (matchingItems.length > 0) {
    return { type: "history", historyItems: matchingItems } as const;
  } else hideAssist();
};

const handleDate = (val: string) => {
  if (val === "date") {
    return { type: "date" } as const;
  }
};

const handleMath = (val: string) => {
  try {
    const result = evaluate(val);
    if (isNumber(result)) {
      return { type: "math", result } as const;
    }
  } catch {
    if (val !== "date") hideAssist();
  }
};

const handleDefinition = async (val: string) => {
  if (val.endsWith(" def") || val.endsWith(" definition")) {
    const word = val.replace(/ def$/, "").replace(/ definition$/, "");

    try {
      // prettier-ignore
      const response = await fetch(`https://raw.githubusercontent.com/open-dictionary/english-dictionary/master/${word[0]}/${word[1]}/${word}/en.json`);
      // const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      const data = await response.json();
      return { type: "definition", result: data } as const;
    } catch {}
  }
};

const handleConversion = (val: string) => {
  const regexes = {
    inches: /^(\d+)\s?in\s*$/,
    centimeters: /^(\d+)\s?cm\s*$/,
    pounds: /^(\d+)\s?lbs?\s*$/,
    kilograms: /^(\d+)\s?kg\s*$/
  };

  const matchConversion = (regex: RegExp, type: string) => {
    const match = val.match(regex);
    if (match) {
      const value = parseInt(match[1], 10);
      let converted: string;
      let unit: string;

      if (type === "in") {
        converted = (value * 2.54).toFixed(2);
        unit = "cm";
      } else if (type === "cm") {
        converted = (value / 2.54).toFixed(2);
        unit = "in";
      } else if (type === "lbs") {
        converted = (value * 0.453592).toFixed(2);
        unit = "kg";
      } else {
        converted = (value / 0.453592).toFixed(2);
        unit = "lbs";
      }

      return {
        type: "conversion",
        before: `${value} ${type}`,
        after: `${converted} ${unit}`
      } as const;
    }
  };

  return (
    matchConversion(regexes.inches, "in") ||
    matchConversion(regexes.centimeters, "cm") ||
    matchConversion(regexes.pounds, "lbs") ||
    matchConversion(regexes.kilograms, "kg")
  );
};
