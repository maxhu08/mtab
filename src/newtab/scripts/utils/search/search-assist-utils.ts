import { Config, UIStyle } from "src/utils/config";
import { assistantContainerEl } from "src/newtab/scripts/ui";

export type AssistItem =
  | AssistDate
  | AssistMath
  | AssistDefinition
  | AssistConversion
  | AssistPasswordGenerator;

export interface AssistDate {
  type: "date";
}

export interface AssistMath {
  type: "math";
  result: string;
}

export interface AssistDefinition {
  type: "definition";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

export interface AssistConversion {
  type: "conversion";
  before: string;
  after: string[];
}

export interface AssistPasswordGenerator {
  type: "password-generator";
  result: string;
  flags: {
    allowLowercase: boolean;
    allowUppercase: boolean;
    allowNumbers: boolean;
    allowSymbols: boolean;
    memorable: boolean;
  };
}

export const hideAssist = () => {
  assistantContainerEl.innerHTML = "";
  assistantContainerEl.classList.replace("grid", "hidden");
};

const createAssistItemWrapper = (uiStyle: UIStyle, sidePadding: boolean) => {
  // <div class="font-search corner-style hidden w-full grid grid-flow-row gap-2 ${sidePadding ? 'p-2' : 'py-2'} text-base md:text-2xl overflow-hidden ${uiStyle === 'glass' ? 'glass-effect' : 'bg-foreground'}"></div>

  const el = document.createElement("div");

  el.className = [
    "font-search",
    "corner-style",
    "hidden",
    "w-full",
    "grid",
    "grid-flow-row",
    "gap-2",
    sidePadding ? "p-2" : "py-2",
    "text-base",
    "md:text-2xl",
    "overflow-hidden",
    uiStyle === "glass" ? "glass-effect" : "bg-foreground"
  ].join(" ");

  return el;
};

const showWrapper = (el: HTMLElement) => {
  if (el.classList.contains("hidden")) el.classList.remove("hidden");
};

export const displayAssist = (items: AssistItem[], config: Config) => {
  assistantContainerEl.innerHTML = "";
  assistantContainerEl.classList.replace("hidden", "grid");

  items.forEach((item) => {
    const assistItemWrapperEl = createAssistItemWrapper(
      config.ui.style,
      item.type !== "password-generator"
    );
    assistantContainerEl.appendChild(assistItemWrapperEl);

    if (item.type === "date") {
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">
      //     Monday, January 1, 2026
      //   </div>
      // </div>

      const gridContainerEl = document.createElement("div");
      gridContainerEl.className = "w-full grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "font-semibold";
      spanEl.style.color = config.search.placeholderTextColor;
      spanEl.innerHTML = "&nbsp;=&nbsp;";

      const dateTextEl = document.createElement("div");
      dateTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
      dateTextEl.style.color = config.search.textColor;
      dateTextEl.textContent = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
      }).format(new Date());

      gridContainerEl.appendChild(spanEl);
      gridContainerEl.appendChild(dateTextEl);
      assistItemWrapperEl.appendChild(gridContainerEl);
      showWrapper(assistItemWrapperEl);
    } else if (item.type === "math") {
      // <div class="w-full grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">
      //     42
      //   </div>
      // </div>

      const gridContainerEl = document.createElement("div");
      gridContainerEl.className = "w-full grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "font-semibold";
      spanEl.style.color = config.search.placeholderTextColor;
      spanEl.innerHTML = "&nbsp;=&nbsp;";

      const resultTextEl = document.createElement("div");
      resultTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
      resultTextEl.style.color = config.search.textColor;
      resultTextEl.textContent = item.result;

      gridContainerEl.appendChild(spanEl);
      gridContainerEl.appendChild(resultTextEl);
      assistItemWrapperEl.appendChild(gridContainerEl);
      showWrapper(assistItemWrapperEl);

      const resultAsNum = parseFloat(item.result);
      if (
        typeof resultAsNum === "number" &&
        (resultAsNum >= 9007199254740991 || resultAsNum <= -9007199254740991)
      ) {
        // <div class="grid grid-cols-[max-content_auto]">
        //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;*&nbsp;</span>
        //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">
        //     reduced precision
        //   </div>
        // </div>

        const warnEl = document.createElement("div");
        warnEl.className = "w-full grid grid-cols-[max-content_auto]";

        const warnSpanEl = document.createElement("span");
        warnSpanEl.className = "font-semibold";
        warnSpanEl.style.color = config.search.placeholderTextColor;
        warnSpanEl.innerHTML = "&nbsp;*&nbsp;";

        const warnTextEl = document.createElement("div");
        warnTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
        warnTextEl.style.color = config.search.placeholderTextColor;
        warnTextEl.textContent = "reduced precision";

        warnEl.appendChild(warnSpanEl);
        warnEl.appendChild(warnTextEl);
        assistItemWrapperEl.appendChild(warnEl);
      }
    } else if (item.type === "definition") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item.result.definitions.slice(0, 3).forEach((def: any) => {
        // <div class="grid grid-cols-[max-content_auto]">
        //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;-&nbsp;</span>
        //   <div class="w-full" style="color: ${config.search.textColor}">
        //     definition <span style="color: ${config.search.placeholderTextColor}">(noun)</span>
        //   </div>
        // </div>

        const gridContainerEl = document.createElement("div");
        gridContainerEl.className = "w-full grid grid-cols-[max-content_auto]";

        const spanEl = document.createElement("span");
        spanEl.className = "font-semibold";
        spanEl.style.color = config.search.placeholderTextColor;
        spanEl.innerHTML = "&nbsp;-&nbsp;";

        const definitionEl = document.createElement("div");
        definitionEl.className = "w-full";
        definitionEl.style.color = config.search.textColor;
        definitionEl.innerHTML = `${def.definition} <span style="color: ${config.search.placeholderTextColor}">(${def.pos})</span>`;

        gridContainerEl.appendChild(spanEl);
        gridContainerEl.appendChild(definitionEl);
        assistItemWrapperEl.appendChild(gridContainerEl);
        showWrapper(assistItemWrapperEl);
      });
    } else if (item.type === "conversion") {
      // <div class="w-full py-4">
      //   <div class="w-full grid grid-cols-[1fr_max-content_1fr] gap-x-3">...</div>
      // </div>

      const outerContainerEl = document.createElement("div");
      outerContainerEl.className = "w-full py-4";

      const parentGridEl = document.createElement("div");
      parentGridEl.className = "w-full grid grid-cols-[1fr_max-content_1fr] gap-x-3";
      parentGridEl.style.color = config.search.textColor;

      const rows = item.after ?? [];
      if (!rows.length) return;

      const splitNumberAndUnit = (value: string) => {
        const parts = value.trim().split(/\s+/);
        return parts.length > 1
          ? { num: parts.slice(0, -1).join(" "), unit: parts[parts.length - 1]! }
          : { num: value, unit: "" };
      };

      const makeSideGrid = () => {
        const el = document.createElement("div");
        el.className = "grid grid-cols-[max-content_1ch_max-content] mx-auto";
        el.style.rowGap = "0.5rem";
        return el;
      };

      const makeArrowGrid = () => {
        const el = document.createElement("div");
        el.className = "grid place-items-center";
        el.style.rowGap = "0.5rem";
        return el;
      };

      const leftGrid = makeSideGrid();
      const arrowGrid = makeArrowGrid();
      const rightGrid = makeSideGrid();

      rows.forEach((row) => {
        const left = splitNumberAndUnit(item.before);
        const right = splitNumberAndUnit(row);

        [left, right].forEach((side, idx) => {
          const target = idx === 0 ? leftGrid : rightGrid;

          const numEl = document.createElement("span");
          numEl.className = "text-right";
          numEl.textContent = side.num;

          const gapEl = document.createElement("span");
          gapEl.className = "w-[1ch]";

          const unitEl = document.createElement("span");
          unitEl.style.color = config.search.placeholderTextColor;
          unitEl.textContent = side.unit;

          target.appendChild(numEl);
          target.appendChild(gapEl);
          target.appendChild(unitEl);
        });

        const arrowEl = document.createElement("span");
        arrowEl.style.color = config.search.placeholderTextColor;
        arrowEl.textContent = "=>";
        arrowGrid.appendChild(arrowEl);
      });

      parentGridEl.appendChild(leftGrid);
      parentGridEl.appendChild(arrowGrid);
      parentGridEl.appendChild(rightGrid);

      outerContainerEl.appendChild(parentGridEl);
      assistItemWrapperEl.appendChild(outerContainerEl);
      showWrapper(assistItemWrapperEl);
    } else if (item.type === "password-generator") {
      // <div class="grid grid-cols-[max-content_auto] text-left w-full rounded-md">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">
      //     ${item.result}
      //   </div>
      // </div>
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;-&nbsp;</span>
      //   <div style="color: ${config.search.textColor}">length ${item.result.length}</div>
      // </div>
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${enabled ? config.search.selectIconColor : config.search.placeholderTextColor}">
      //     &nbsp;${enabled ? "V" : "X"}&nbsp;
      //   </span>
      //   <div>
      //     <span style="color: ${enabled ? config.search.textColor : config.search.placeholderTextColor}">
      //       ${label}
      //     </span>
      //     <span style="color: ${config.search.placeholderTextColor}">
      //       (${flag})
      //     </span>
      //   </div>
      // </div>
      // <div class="w-full h-[1px] rounded-md my-auto" style="background-color: ${config.search.placeholderTextColor}"></div>

      const rowEl = document.createElement("div");
      rowEl.className = "grid grid-cols-[max-content_auto] text-left w-full rounded-md";

      const spanEl = document.createElement("span");
      spanEl.className = "font-semibold";
      spanEl.style.color = config.search.placeholderTextColor;
      spanEl.innerHTML = "&nbsp;=&nbsp;";

      const passwordEl = document.createElement("div");
      passwordEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
      passwordEl.style.color = config.search.placeholderTextColor;
      passwordEl.textContent = item.result;

      rowEl.appendChild(spanEl);
      rowEl.appendChild(passwordEl);
      assistItemWrapperEl.appendChild(rowEl);

      const makeLengthRow = (label: string) => {
        const rowEl = document.createElement("div");
        rowEl.className = "grid grid-cols-[max-content_auto]";

        const dashEl = document.createElement("span");
        dashEl.className = "font-semibold";
        dashEl.style.color = config.search.placeholderTextColor;
        dashEl.innerHTML = "&nbsp;-&nbsp;";

        const textEl = document.createElement("div");
        textEl.style.color = config.search.textColor;
        textEl.textContent = label;

        rowEl.appendChild(dashEl);
        rowEl.appendChild(textEl);
        assistItemWrapperEl.appendChild(rowEl);
      };

      const makeFlagRow = (label: string, flagChar: string, enabled: boolean) => {
        const rowEl = document.createElement("div");
        rowEl.className = "grid grid-cols-[max-content_auto]";

        const markerEl = document.createElement("span");
        markerEl.className = "font-semibold";
        markerEl.style.color = enabled
          ? config.search.selectIconColor
          : config.search.placeholderTextColor;
        markerEl.innerHTML = `&nbsp;${enabled ? "V" : "X"}&nbsp;`;

        const textWrapEl = document.createElement("div");

        const labelEl = document.createElement("span");
        labelEl.style.color = enabled
          ? config.search.textColor
          : config.search.placeholderTextColor;
        labelEl.textContent = label;

        const flagEl = document.createElement("span");
        flagEl.style.color = config.search.placeholderTextColor;
        flagEl.textContent = ` (${flagChar})`;

        textWrapEl.appendChild(labelEl);
        textWrapEl.appendChild(flagEl);

        rowEl.appendChild(markerEl);
        rowEl.appendChild(textWrapEl);
        assistItemWrapperEl.appendChild(rowEl);
        showWrapper(assistItemWrapperEl);
      };

      makeLengthRow(`length ${item.result.length}`);

      makeFlagRow("lowercase", "l", item.flags.allowLowercase);
      makeFlagRow("uppercase", "u", item.flags.allowUppercase);
      makeFlagRow("numbers", "n", item.flags.allowNumbers);
      makeFlagRow("symbols", "s", item.flags.allowSymbols);
      makeFlagRow("memorable", "m", item.flags.memorable);
    }
  });
};
