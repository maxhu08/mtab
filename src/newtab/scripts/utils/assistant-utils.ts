import { assistantContainerEl } from "src/newtab/scripts/ui";

type AssistItem = HistoryList;

interface HistoryList {
  type: "history";
  historyItems: chrome.history.HistoryItem[];
}

export const displayAssist = (items: AssistItem[]) => {
  assistantContainerEl.innerHTML = "";

  items.forEach((item) => {
    if (item.type === "history") {
      item.historyItems.forEach((hi) => {
        assistantContainerEl.textContent! += hi.title;
      });
    }
  });
};
