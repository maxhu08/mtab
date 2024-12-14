import { hideAssist } from "src/newtab/scripts/utils/search/search-assist-utils";

export const handleHistory = (val: string, history: chrome.history.HistoryItem[]) => {
  const matchingItems = history
    .filter((h) => h.title?.toLocaleLowerCase().startsWith(val.toLowerCase()))
    .slice(0, 6);

  if (matchingItems.length > 0) {
    return { type: "history", historyItems: matchingItems } as const;
  } else hideAssist();
};
