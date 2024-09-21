import { Config } from "src/newtab/scripts/config";
import { assistantContainerEl } from "src/newtab/scripts/ui";

type AssistItem = HistoryList;

interface HistoryList {
  type: "history";
  historyItems: chrome.history.HistoryItem[];
}
4;
export const hideAssist = () => {
  assistantContainerEl.innerHTML = "";
  assistantContainerEl.classList.replace("grid", "hidden");
};

export const displayAssist = (items: AssistItem[], config: Config) => {
  assistantContainerEl.innerHTML = "";
  assistantContainerEl.classList.replace("hidden", "grid");

  items.forEach((item) => {
    if (item.type === "history") {
      item.historyItems.forEach((hi) => {
        assistantContainerEl.innerHTML += `
        <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">
          ${hi.title}
        </div>`;
      });
    }
  });
};
