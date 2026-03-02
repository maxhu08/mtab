import { colorInputs } from "~/src/options/scripts/ui";

type ColorFieldInput = {
  container: HTMLDivElement;
  input: HTMLInputElement;
};

const canvasContext = document.createElement("canvas").getContext("2d");
const controls = new Map<
  HTMLInputElement,
  {
    previewEl: HTMLButtonElement;
    pickerInputEl: HTMLInputElement;
  }
>();

const rgbStringToHex = (value: string) => {
  const matches = value.match(/\d+/g);
  if (!matches || matches.length < 3) return null;

  const [r, g, b] = matches.slice(0, 3).map((match) => Number.parseInt(match, 10));

  return `#${[r, g, b].map((part) => part.toString(16).padStart(2, "0")).join("")}`;
};

const normalizeCssColorToHex = (value: string) => {
  if (!canvasContext) return null;

  canvasContext.fillStyle = "#000000";
  canvasContext.fillStyle = value;

  const normalized = canvasContext.fillStyle.toLowerCase();
  if (normalized.startsWith("#")) return normalized;
  if (normalized.startsWith("rgb")) return rgbStringToHex(normalized);

  return null;
};

const createColorControl = ({ container, input }: ColorFieldInput) => {
  if (controls.has(input)) return;

  container.classList.add("options-color-field");
  input.classList.remove("w-full");

  const shellEl = document.createElement("div");
  shellEl.className = "options-color-picker-shell";

  const previewEl = document.createElement("button");
  previewEl.type = "button";
  previewEl.className = "options-color-picker";
  previewEl.setAttribute("aria-hidden", "true");
  previewEl.tabIndex = -1;

  const pickerInputEl = document.createElement("input");
  pickerInputEl.type = "color";
  pickerInputEl.className = "options-color-picker-input-overlay";
  pickerInputEl.setAttribute(
    "aria-label",
    `${input.id.replace(/-input$/, "").replace(/-/g, " ")} color picker`
  );

  shellEl.append(previewEl, pickerInputEl);
  container.append(shellEl);

  controls.set(input, {
    previewEl,
    pickerInputEl
  });

  input.addEventListener("input", () => {
    syncColorInputControl(input);
  });

  pickerInputEl.addEventListener("input", () => {
    input.value = pickerInputEl.value;
    syncColorInputControl(input);
  });
};

export const initColorInputControls = () => {
  colorInputs.forEach((field) => {
    createColorControl(field);
  });
};

export const registerColorInputControl = (field: ColorFieldInput) => {
  createColorControl(field);
  syncColorInputControl(field.input);
};

export const syncColorInputControl = (input: HTMLInputElement) => {
  const control = controls.get(input);
  if (!control) return;

  const value = input.value.trim();
  control.previewEl.style.setProperty("--options-color-preview", value || "transparent");

  const normalizedColor = normalizeCssColorToHex(value);
  if (normalizedColor) {
    control.pickerInputEl.value = normalizedColor;
  }
};

export const syncAllColorInputControls = () => {
  colorInputs.forEach(({ input }) => {
    syncColorInputControl(input);
  });
};
