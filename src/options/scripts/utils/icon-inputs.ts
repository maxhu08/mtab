import {
  bookmarksDefaultFolderIconTypeContainerEl,
  bookmarksDefaultFolderIconTypeInputEl
} from "~/src/options/scripts/ui";
import { showIconPickerModal } from "~/src/options/scripts/utils/input-dialog";
import { createBookmarkIcon } from "~/src/utils/bookmark-icon";

type IconFieldInput = {
  container: HTMLDivElement;
  input: HTMLInputElement;
  getFallbackIconType?: () => string | null | undefined;
};

const iconPreviewColor = "#ffffff";

const controls = new Map<
  HTMLInputElement,
  {
    previewEl: HTMLButtonElement;
    getFallbackIconType?: () => string | null | undefined;
  }
>();

const createIconPickerPreviewIcon = (iconType: string) => {
  const icon = createBookmarkIcon(iconType, iconPreviewColor, iconPreviewColor);
  if (!icon) return null;

  const iconEl = document.createElement("span");
  iconEl.className = "options-icon-picker-icon";
  iconEl.append(icon.iconEl);
  return iconEl;
};

const renderIconPreview = (previewEl: HTMLButtonElement, iconType: string) => {
  previewEl.replaceChildren();

  if (!iconType) return;

  const iconEl = createIconPickerPreviewIcon(iconType);
  if (!iconEl) return;

  previewEl.append(iconEl);
};

const createIconControl = ({ container, input, getFallbackIconType }: IconFieldInput) => {
  if (controls.has(input)) return;

  container.classList.add("options-icon-field");
  input.classList.remove("w-full");

  const shellEl = document.createElement("div");
  shellEl.className = "options-icon-picker-shell";

  const previewEl = document.createElement("button");
  previewEl.type = "button";
  previewEl.className = "options-icon-picker";
  previewEl.setAttribute(
    "aria-label",
    `${input.id.replace(/-input$/, "").replace(/-/g, " ")} icon picker`
  );
  previewEl.setAttribute("aria-haspopup", "dialog");
  previewEl.setAttribute("data-tippy-content", "choose icon");

  shellEl.append(previewEl);
  container.append(shellEl);

  controls.set(input, {
    previewEl,
    getFallbackIconType
  });

  input.addEventListener("input", () => {
    syncIconInputControl(input);
  });

  previewEl.addEventListener("click", () => {
    void showIconPickerModal();
  });
};

export const initIconInputControls = () => {
  createIconControl({
    container: bookmarksDefaultFolderIconTypeContainerEl,
    input: bookmarksDefaultFolderIconTypeInputEl
  });

  bookmarksDefaultFolderIconTypeInputEl.addEventListener("input", syncAllIconInputControls);
};

export const registerIconInputControl = (field: IconFieldInput) => {
  createIconControl(field);
  syncIconInputControl(field.input);
};

export const syncIconInputControl = (input: HTMLInputElement) => {
  const control = controls.get(input);
  if (!control) return;

  const value = input.value.trim() || control.getFallbackIconType?.()?.trim() || "";
  renderIconPreview(control.previewEl, value);
};

export const syncAllIconInputControls = () => {
  controls.forEach((_, input) => {
    syncIconInputControl(input);
  });
};