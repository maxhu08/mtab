import "vanilla-colorful/hex-alpha-color-picker.js";
import { colorInputs } from "~/src/options/scripts/ui";

type ColorFieldInput = {
  container: HTMLDivElement;
  input: HTMLInputElement;
};

const canvasContext = document.createElement("canvas").getContext("2d");
const controls = new Map<
  HTMLInputElement,
  {
    pickerEl: HexAlphaColorPickerElement;
    popupEl: HTMLDivElement;
    previewEl: HTMLButtonElement;
  }
>();

type HexAlphaColorPickerElement = HTMLElement & {
  color: string;
};

const clampColorPart = (value: number): number => {
  return Math.max(0, Math.min(255, Math.round(value)));
};

const toHexPart = (value: number): string => {
  return clampColorPart(value).toString(16).padStart(2, "0");
};

const rgbStringToHexAlpha = (value: string): string | null => {
  const matches = value.match(/[\d.]+/g);
  if (!matches || matches.length < 3) return null;

  const [r, g, b] = matches.slice(0, 3).map(Number);
  const alpha = matches[3] === undefined ? null : Number(matches[3]);
  const alphaHex =
    alpha === null || Number.isNaN(alpha) ? "" : toHexPart(Math.max(0, Math.min(1, alpha)) * 255);

  return `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}${alphaHex}`;
};

const normalizeCssColorToHexAlpha = (value: string): string | null => {
  if (!canvasContext) return null;

  canvasContext.fillStyle = "#000000";
  canvasContext.fillStyle = value;

  const normalized = canvasContext.fillStyle.toLowerCase();
  if (normalized.startsWith("#")) return normalized;
  if (normalized.startsWith("rgb")) return rgbStringToHexAlpha(normalized);

  return null;
};

const setPreviewColor = (previewEl: HTMLButtonElement, value: string): void => {
  previewEl.style.setProperty("--options-color-preview", value || "transparent");
};

const createColorControl = ({ container, input }: ColorFieldInput): void => {
  if (controls.has(input)) return;

  container.classList.add("options-color-field");
  input.classList.remove("w-full");

  const shellEl = document.createElement("div");
  shellEl.className = "options-color-picker-shell";

  const previewEl = document.createElement("button");
  previewEl.type = "button";
  previewEl.className = "options-color-picker";
  previewEl.setAttribute(
    "aria-label",
    `${input.id.replace(/-input$/, "").replace(/-/g, " ")} color picker`
  );
  previewEl.setAttribute("aria-haspopup", "dialog");
  previewEl.setAttribute("aria-expanded", "false");

  const popupEl = document.createElement("div");
  popupEl.className = "options-color-picker-popup";
  popupEl.hidden = true;

  const pickerEl = document.createElement("hex-alpha-color-picker") as HexAlphaColorPickerElement;
  popupEl.append(pickerEl);
  shellEl.append(previewEl, popupEl);
  container.append(shellEl);

  let pendingValue = input.value.trim();
  let isOpen = false;

  const commitPendingValue = (): void => {
    if (!pendingValue || input.value === pendingValue) return;

    input.value = pendingValue;
    syncColorInputControl(input);
  };

  const closePopup = (commit: boolean): void => {
    if (!isOpen) return;

    isOpen = false;
    popupEl.hidden = true;
    shellEl.classList.remove("is-open");
    previewEl.setAttribute("aria-expanded", "false");

    document.removeEventListener("pointerdown", handleDocumentPointerDown);
    document.removeEventListener("pointerup", handleDocumentPointerUp);
    document.removeEventListener("keydown", handleDocumentKeyDown);

    if (commit) {
      commitPendingValue();
      return;
    }

    syncColorInputControl(input);
  };

  const openPopup = (): void => {
    if (isOpen) return;

    isOpen = true;
    pendingValue = input.value.trim();
    popupEl.hidden = false;
    shellEl.classList.add("is-open");
    previewEl.setAttribute("aria-expanded", "true");

    const normalizedColor = normalizeCssColorToHexAlpha(input.value.trim());
    if (normalizedColor) {
      pickerEl.color = normalizedColor;
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("pointerup", handleDocumentPointerUp);
    document.addEventListener("keydown", handleDocumentKeyDown);
  };

  function handleDocumentPointerDown(event: PointerEvent): void {
    if (shellEl.contains(event.target as Node)) return;

    closePopup(true);
  }

  function handleDocumentPointerUp(): void {
    if (!isOpen) return;

    commitPendingValue();
  }

  function handleDocumentKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      closePopup(false);
      previewEl.focus();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      closePopup(true);
      previewEl.focus();
    }
  }

  previewEl.addEventListener("click", () => {
    if (isOpen) {
      closePopup(true);
      return;
    }

    openPopup();
  });

  controls.set(input, {
    pickerEl,
    popupEl,
    previewEl
  });

  input.addEventListener("input", () => {
    syncColorInputControl(input);
  });

  pickerEl.addEventListener("color-changed", (event: Event) => {
    const value = (event as CustomEvent<{ value: string }>).detail.value.toLowerCase();
    pendingValue = value;
    setPreviewColor(previewEl, value);
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
  setPreviewColor(control.previewEl, value);

  const normalizedColor = normalizeCssColorToHexAlpha(value);
  if (normalizedColor) {
    control.pickerEl.color = normalizedColor;
  }
};

export const syncAllColorInputControls = () => {
  colorInputs.forEach(({ input }) => {
    syncColorInputControl(input);
  });
};