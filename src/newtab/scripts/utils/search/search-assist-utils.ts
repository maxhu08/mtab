import { Config } from "src/utils/config";
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

export const displayAssist = (items: AssistItem[], config: Config) => {
  assistantContainerEl.innerHTML = "";
  assistantContainerEl.classList.replace("hidden", "grid");

  items.forEach((item, index) => {
    if (item.type === "date") {
      const date = new Date();
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">
      //     ${new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(date)}
      //   </div>
      // </div>

      const gridContainerEl = document.createElement("div");
      gridContainerEl.className = "grid grid-cols-[max-content_auto]";

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
      }).format(date);

      gridContainerEl.appendChild(spanEl);
      gridContainerEl.appendChild(dateTextEl);
      assistantContainerEl.appendChild(gridContainerEl);
    } else if (item.type === "math") {
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">${item.result}</div>
      // </div>

      const gridContainerEl = document.createElement("div");
      gridContainerEl.className = "grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "font-semibold";
      spanEl.style.color = config.search.placeholderTextColor;
      spanEl.innerHTML = "&nbsp;=&nbsp;";

      const resultTextEl = document.createElement("div");
      resultTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
      resultTextEl.style.color = config.search.textColor;
      resultTextEl.textContent = item.result.toString();

      gridContainerEl.appendChild(spanEl);
      gridContainerEl.appendChild(resultTextEl);
      assistantContainerEl.appendChild(gridContainerEl);

      const resultAsNum = parseFloat(item.result);
      if (
        typeof resultAsNum === "number" &&
        (resultAsNum >= 9007199254740991 || resultAsNum <= -9007199254740991)
      ) {
        // <div class="grid grid-cols-[max-content_auto]">
        //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;*&nbsp;</span>
        //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">reduced precision</div>
        // </div>

        const gridContainerEl = document.createElement("div");
        gridContainerEl.className = "grid grid-cols-[max-content_auto]";

        const spanEl = document.createElement("span");
        spanEl.className = "font-semibold";
        spanEl.style.color = config.search.placeholderTextColor;
        spanEl.innerHTML = "&nbsp;*&nbsp;";

        const precisionTextEl = document.createElement("div");
        precisionTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
        precisionTextEl.style.color = config.search.placeholderTextColor;
        precisionTextEl.textContent = "reduced precision";

        gridContainerEl.appendChild(spanEl);
        gridContainerEl.appendChild(precisionTextEl);
        assistantContainerEl.appendChild(gridContainerEl);
      }
    } else if (item.type === "definition") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item.result.definitions.slice(0, 3).forEach((def: any) => {
        // <div class="grid grid-cols-[max-content_auto]">
        //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;-&nbsp;</span>
        //   <div class="w-full" style="color: ${config.search.textColor}">${def.definition} <span style="color: ${config.search.placeholderTextColor}">(${def.pos})</span></div>
        // </div>

        const gridContainerEl = document.createElement("div");
        gridContainerEl.className = "grid grid-cols-[max-content_auto]";

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
        assistantContainerEl.appendChild(gridContainerEl);
      });
    } else if (item.type === "conversion") {
      // <div class="w-full py-4">
      //   <div class="w-full grid grid-cols-[1fr_max-content_1fr] gap-x-3">
      //     <div class="grid grid-cols-[max-content_1ch_max-content] mx-auto" style="row-gap: .5rem">
      //       <span class="text-right"><!-- left num row 1 --></span><span class="w-[1ch]"></span><span><!-- left unit row 1 --></span>
      //       <span class="text-right"><!-- left num row 2 --></span><span class="w-[1ch]"></span><span><!-- left unit row 2 --></span>
      //       ...
      //     </div>
      //     <div class="grid place-items-center" style="row-gap: .5rem">
      //       <span><!-- => row 1 --></span>
      //       <span><!-- => row 2 --></span>
      //       ...
      //     </div>
      //     <div class="grid grid-cols-[max-content_1ch_max-content] mx-auto" style="row-gap: .5rem">
      //       <span class="text-right"><!-- right num row 1 --></span><span class="w-[1ch]"></span><span><!-- right unit row 1 --></span>
      //       <span class="text-right"><!-- right num row 2 --></span><span class="w-[1ch]"></span><span><!-- right unit row 2 --></span>
      //       ...
      //     </div>
      //   </div>
      // </div>

      const outerContainerEl = document.createElement("div");
      outerContainerEl.className = "w-full py-4";

      const parentGridEl = document.createElement("div");
      parentGridEl.className = "w-full grid grid-cols-[1fr_max-content_1fr] gap-x-3";
      parentGridEl.style.color = config.search.textColor;

      const rows = item.after?.length ? item.after : [];
      if (rows.length === 0) return;

      const splitNumberAndUnit = (value: string) => {
        const parts = value.trim().split(/\s+/).filter(Boolean);
        if (parts.length <= 1) return { num: value.trim(), unit: "" };
        return { num: parts.slice(0, -1).join(" "), unit: parts[parts.length - 1] };
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

      const leftGridEl = makeSideGrid();
      const arrowGridEl = makeArrowGrid();
      const rightGridEl = makeSideGrid();

      const appendSideTriplet = (gridEl: HTMLDivElement, value: string) => {
        const { num, unit } = splitNumberAndUnit(value);

        const numEl = document.createElement("span");
        numEl.className = "text-right";
        numEl.style.color = config.search.textColor;
        numEl.textContent = num;

        const gapEl = document.createElement("span");
        gapEl.className = "w-[1ch]";
        gapEl.textContent = "";

        const unitEl = document.createElement("span");
        unitEl.style.color = config.search.placeholderTextColor;
        unitEl.textContent = unit;

        gridEl.appendChild(numEl);
        gridEl.appendChild(gapEl);
        gridEl.appendChild(unitEl);
      };

      const appendArrow = () => {
        const arrowEl = document.createElement("span");
        arrowEl.style.color = config.search.placeholderTextColor;
        arrowEl.textContent = "=>";
        arrowGridEl.appendChild(arrowEl);
      };

      for (let i = 0; i < rows.length; i++) {
        appendSideTriplet(leftGridEl, item.before);
        appendArrow();
        appendSideTriplet(rightGridEl, rows[i]);
      }

      parentGridEl.appendChild(leftGridEl);
      parentGridEl.appendChild(arrowGridEl);
      parentGridEl.appendChild(rightGridEl);

      outerContainerEl.appendChild(parentGridEl);
      assistantContainerEl.appendChild(outerContainerEl);
    } else if (item.type === "password-generator") {
      // <div class="grid grid-cols-[max-content_auto] text-left w-full rounded-md">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">
      //     ${item.result}
      //   </div>
      // </div>
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;-&nbsp;</span>
      //   <span style="color: ${enabled ? config.search.textColor : config.search.placeholderTextColor}">
      //     lowercase
      //   </span>
      // </div>
      // ...

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
      assistantContainerEl.appendChild(rowEl);

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
        assistantContainerEl.appendChild(rowEl);
      };

      const makeFlagRow = (label: string, flagChar: string, enabled: boolean) => {
        const rowEl = document.createElement("div");
        rowEl.className = "grid grid-cols-[max-content_auto]";

        const markerEl = document.createElement("span");
        markerEl.className = "font-semibold";
        markerEl.style.color = config.search.placeholderTextColor;
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
        assistantContainerEl.appendChild(rowEl);
      };

      makeLengthRow(`length ${item.result.length}`);

      makeFlagRow("lowercase", "l", item.flags.allowLowercase);
      makeFlagRow("uppercase", "u", item.flags.allowUppercase);
      makeFlagRow("numbers", "n", item.flags.allowNumbers);
      makeFlagRow("symbols", "s", item.flags.allowSymbols);
      makeFlagRow("memorable", "m", item.flags.memorable);
    }

    if (index !== items.length - 1) {
      // <div class="w-full h-[1px] rounded-md my-auto" style="background-color: ${config.search.placeholderTextColor}"></div>

      const dividerEl = document.createElement("div");
      dividerEl.className = "w-full h-[1px] rounded-md my-auto";
      dividerEl.style.backgroundColor = config.search.placeholderTextColor;

      assistantContainerEl.appendChild(dividerEl);
    }
  });
};
