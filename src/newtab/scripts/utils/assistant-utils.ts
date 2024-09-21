import { Config } from "src/newtab/scripts/config";
import { assistantContainerEl } from "src/newtab/scripts/ui";

type AssistItem = AssistHistoryList | AssistDate;

interface AssistHistoryList {
  type: "history";
  historyItems: chrome.history.HistoryItem[];
}

interface AssistDate {
  type: "date";
}

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
    } else if (item.type === "date") {
      const date = new Date();

      assistantContainerEl.innerHTML += `
        <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${
          config.search.placeholderTextColor
        }">
          ${new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long"
          }).format(date)}
        </div>`;
    }
  });
};
