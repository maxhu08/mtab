import { Config, UIStyle } from "src/utils/config";
import { assistantContainerEl } from "src/newtab/scripts/ui";

export type AssistItem =
  | AssistDate
  | AssistMath
  | AssistDefinition
  | AssistConversion
  | AssistConversionCurrency
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

export interface AssistConversionCurrency {
  type: "conversion-currency";
  before: string;
  after: string;
  timestamp: number;
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
  const el = document.createElement("div");

  el.className = [
    "font-search",
    "corner-style",
    "hidden",
    "w-full",
    "grid",
    "grid-flow-row",
    "gap-2",
    "text-base",
    "md:text-2xl",
    "overflow-hidden",
    uiStyle === "glass" ? "glass-effect" : "bg-foreground",
    sidePadding && "p-2"
  ]
    .filter(Boolean)
    .join(" ");

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
      spanEl.className = "font-semibold select-none";
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
      //   <span class="font-semibold select-none" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">
      //     42
      //   </div>
      // </div>

      const gridContainerEl = document.createElement("div");
      gridContainerEl.className = "w-full grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "font-semibold select-none";
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
        //   <span class="font-semibold select-none" style="color: ${config.search.placeholderTextColor}">&nbsp;*&nbsp;</span>
        //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">
        //     reduced precision
        //   </div>
        // </div>

        const warnEl = document.createElement("div");
        warnEl.className = "w-full grid grid-cols-[max-content_auto]";

        const warnSpanEl = document.createElement("span");
        warnSpanEl.className = "font-semibold select-none";
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
        //   <span class="font-semibold select-none" style="color: ${config.search.placeholderTextColor}">&nbsp;-&nbsp;</span>
        //   <div class="w-full" style="color: ${config.search.textColor}">
        //     definition <span style="color: ${config.search.placeholderTextColor}">(noun)</span>
        //   </div>
        // </div>

        const gridContainerEl = document.createElement("div");
        gridContainerEl.className = "w-full grid grid-cols-[max-content_auto]";

        const spanEl = document.createElement("span");
        spanEl.className = "font-semibold select-none";
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
        arrowEl.className = "select-none";
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
    } else if (item.type === "conversion-currency") {
      // <div class="w-full py-4">
      //   <div class="w-full grid grid-cols-[1fr_max-content_1fr] gap-x-3">...</div>
      // </div>

      const outerContainerEl = document.createElement("div");
      outerContainerEl.className = "w-full py-4";

      const parentGridEl = document.createElement("div");
      parentGridEl.className = "w-full grid grid-cols-[1fr_max-content_1fr] gap-x-3";
      parentGridEl.style.color = config.search.textColor;

      const left = splitNumberAndUnit(item.before);
      const right = splitNumberAndUnit(item.after);

      const makeSideGrid = () => {
        const el = document.createElement("div");
        el.className = "grid grid-cols-[max-content_1ch_max-content] mx-auto";
        el.style.rowGap = "0.5rem";
        return el;
      };

      const leftGrid = makeSideGrid();
      const rightGrid = makeSideGrid();

      const arrowGrid = document.createElement("div");
      arrowGrid.className = "grid place-items-center";
      arrowGrid.style.rowGap = "0.5rem";

      const addSide = (target: HTMLElement, side: { num: string; unit: string }) => {
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
      };

      addSide(leftGrid, left);

      const arrowEl = document.createElement("span");
      arrowEl.className = "select-none";
      arrowEl.style.color = config.search.placeholderTextColor;
      arrowEl.textContent = "=>";
      arrowGrid.appendChild(arrowEl);

      addSide(rightGrid, right);

      parentGridEl.appendChild(leftGrid);
      parentGridEl.appendChild(arrowGrid);
      parentGridEl.appendChild(rightGrid);

      outerContainerEl.appendChild(parentGridEl);

      const sinceEl = document.createElement("div");
      sinceEl.className = "text-center";
      sinceEl.style.color = config.search.placeholderTextColor;
      sinceEl.textContent = fmtSinceAgo(item.timestamp);

      outerContainerEl.appendChild(sinceEl);
      assistItemWrapperEl.appendChild(outerContainerEl);
      showWrapper(assistItemWrapperEl);
    } else if (item.type === "password-generator") {
      assistItemWrapperEl.classList.add("pb-2");

      const resultBtn = document.createElement("button");
      resultBtn.className =
        "w-full text-left hover:bg-white/20 cursor-pointer px-2 pt-2 grid gap-2 duration-0";

      resultBtn.onclick = () => {
        navigator.clipboard.writeText(item.result);
      };

      const resultRow = document.createElement("div");
      resultRow.className = "grid grid-cols-[max-content_auto] text-left w-full";

      const eqEl = document.createElement("span");
      eqEl.className = "font-semibold select-none";
      eqEl.style.color = config.search.placeholderTextColor;
      eqEl.innerHTML = "&nbsp;=&nbsp;";

      const passwordEl = document.createElement("div");
      passwordEl.className = "truncate w-full select-none";
      passwordEl.style.color = config.search.placeholderTextColor;

      const passwordTextSpan = document.createElement("span");
      passwordTextSpan.style.color = config.search.textColor;
      passwordTextSpan.textContent = item.result;

      passwordEl.appendChild(passwordTextSpan);

      resultRow.appendChild(eqEl);
      resultRow.appendChild(passwordEl);

      const copyHintEl = document.createElement("div");
      copyHintEl.className = "select-none";
      copyHintEl.style.color = config.search.placeholderTextColor;
      copyHintEl.innerHTML = `&nbsp;&nbsp;&nbsp;click to copy (${item.result.length} chars)`;

      resultBtn.appendChild(resultRow);
      resultBtn.appendChild(copyHintEl);
      assistItemWrapperEl.appendChild(resultBtn);

      const makeFlagRow = (label: string, flagChar: string, enabled: boolean) => {
        const rowEl = document.createElement("div");
        rowEl.className = "grid grid-cols-[max-content_auto] px-2";

        const markerEl = document.createElement("span");
        markerEl.className = "font-semibold select-none";
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

      makeFlagRow("lowercase", "l", item.flags.allowLowercase);
      makeFlagRow("uppercase", "u", item.flags.allowUppercase);
      makeFlagRow("numbers", "n", item.flags.allowNumbers);
      makeFlagRow("symbols", "s", item.flags.allowSymbols);
      makeFlagRow("memorable", "m", item.flags.memorable);
    }
  });
};

const splitNumberAndUnit = (value: string) => {
  const parts = value.trim().split(/\s+/);
  return parts.length > 1
    ? { num: parts.slice(0, -1).join(" "), unit: parts[parts.length - 1]! }
    : { num: value, unit: "" };
};

const fmtSinceAgo = (timestamp: number) => {
  const diffMs = Date.now() - timestamp;
  if (!Number.isFinite(diffMs) || diffMs < 0) return "now";

  const s = Math.floor(diffMs / 1000);
  if (s < 10) return "since just now";
  if (s < 60) return `since ${s}s ago`;

  const m = Math.floor(s / 60);
  if (m < 60) return `since ${m}m ago`;

  const h = Math.floor(m / 60);
  if (h < 24) return `since ${h}h ago`;

  const d = Math.floor(h / 24);
  return `since ${d}d ago`;
};
