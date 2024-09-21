import { Config } from "src/newtab/scripts/config";
import { assistantContainerEl } from "src/newtab/scripts/ui";

type AssistItem = AssistHistoryList | AssistDate | AssistMath | AssistDefinition;

interface AssistHistoryList {
  type: "history";
  historyItems: chrome.history.HistoryItem[];
}

interface AssistDate {
  type: "date";
}

interface AssistMath {
  type: "math";
  result: string;
}

interface AssistDefinition {
  type: "definition";
  result: any;
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
    } else if (item.type === "math") {
      assistantContainerEl.innerHTML += `
        <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">
          ${item.result}
        </div>`;
    } else if (item.type === "definition") {
      item.result.definitions.slice(0, 3).forEach((def: any) => {
        console.log(def);

        assistantContainerEl.innerHTML += `
        <div class="w-full" style="color: ${config.search.textColor}">
          ${def.definition} <span style="color: ${config.search.placeholderTextColor}">(${def.pos})</span>
        </div>`;
      });
    }
  });
};
