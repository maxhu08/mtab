import { Config } from "src/newtab/scripts/config";
import { assistantContainerEl } from "src/newtab/scripts/ui";

export type AssistItem =
  | AssistHistoryList
  | AssistDate
  | AssistMath
  | AssistDefinition
  | AssistConversion;

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

interface AssistConversion {
  type: "conversion";
  before: string;
  after: string;
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
        <div class="grid grid-cols-[max-content_auto]">
          <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;~&nbsp;</span>
          <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">${hi.title}</div>
        </div>`;
      });
    } else if (item.type === "date") {
      const date = new Date();
      assistantContainerEl.innerHTML += `
        <div class="grid grid-cols-[max-content_auto]">
          <span class="font-semibold" style="color: ${
            config.search.placeholderTextColor
          }">&nbsp;=&nbsp;</span>
          <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${
            config.search.textColor
          }">
            ${new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long"
            }).format(date)}
          </div>
        </div>`;
    } else if (item.type === "math") {
      assistantContainerEl.innerHTML += `
        <div class="grid grid-cols-[max-content_auto]">
          <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
          <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">${item.result}</div>
        </div>`;
    } else if (item.type === "definition") {
      item.result.definitions.slice(0, 3).forEach((def: any) => {
        assistantContainerEl.innerHTML += `
          <div class="grid grid-cols-[max-content_auto]">
            <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;-&nbsp;</span>
            <div class="w-full" style="color: ${config.search.textColor}">${def.definition} <span style="color: ${config.search.placeholderTextColor}">(${def.pos})</span></div>
          </div>`;
      });
    } else if (item.type === "conversion") {
      assistantContainerEl.innerHTML += `
          <div class="w-full py-4">
            <div class="w-full grid grid-cols-[1fr_max-content_1fr] place-items-center" style="color: ${config.search.textColor}">
            <span style="color: ${config.search.textColor}">${item.before}</span>
            <span style="color: ${config.search.placeholderTextColor}">=></span>
            <span style="color: ${config.search.textColor}">${item.after}</span>
            </div>
          </div>`;
    }
  });
};
