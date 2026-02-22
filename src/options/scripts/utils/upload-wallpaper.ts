import Sortable from "sortablejs";
import { delegate, Instance } from "tippy.js";
import {
  wallpaperFileUploadInputEl,
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperResetAllButtonEl,
  wallpaperGalleryEl
} from "src/options/scripts/ui";
import {
  addUploadedWallpaperFiles,
  getUploadedWallpaperFile,
  getUploadedWallpaperThumbnail,
  listUploadedWallpaperFiles,
  replaceUploadedWallpaperFile,
  reorderUploadedWallpaperFiles,
  removeUploadedWallpaperFiles,
  resetUploadedWallpaperFiles
} from "src/utils/wallpaper-file-storage";
import {
  MixedUploadedWallpaperFileMeta,
  addMixedUploadedWallpaperFiles,
  addMixedWallpaperSolidColor,
  addMixedWallpaperURL,
  getMixedUploadedWallpaperFile,
  getMixedUploadedWallpaperThumbnail,
  listMixedUploadedWallpaperFiles,
  listMixedWallpaperEntries,
  replaceMixedWallpaperEntryFile,
  removeMixedWallpaperEntries,
  reorderMixedWallpaperEntries,
  resetMixedWallpaperEntries,
  updateMixedWallpaperEntryValue
} from "src/utils/mixed-wallpaper-storage";
import {
  applyWallpaperFilters,
  previewWallpaper,
  previewWallpaperSolidColor
} from "src/options/scripts/utils/preview";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";
import { showActionDialog, showInputDialog } from "src/options/scripts/utils/input-dialog";
import { logger } from "src/utils/logger";

const wallpaperGalleryWrapperEl = document.getElementById(
  "wallpaper-gallery-wrapper"
) as HTMLDivElement | null;
const wallpaperDefaultPreviewSectionEl = document.getElementById(
  "wallpaper-default-preview-section"
) as HTMLDivElement | null;
const wallpaperDefaultPreviewMediaEl = document.getElementById(
  "wallpaper-default-preview-media"
) as HTMLDivElement | null;
const wallpaperResetAllWrapperEl = document.getElementById(
  "wallpaper-reset-all-wrapper"
) as HTMLDivElement | null;
const RANDOM_WALLPAPER_PREVIEW_URL = "https://picsum.photos/seed/mtab-random-preview/1280/720";

type ActiveWallpaperType = "url" | "file-upload" | "random" | "solid-color" | "mixed" | "default";
type MixedAddAction = "url" | "file-upload" | "solid-color";
type EditableWallpaperType = "url" | "file-upload" | "solid-color";
type PendingWallpaperFileReplacement =
  | { scope: "file-upload"; fileId: string }
  | { scope: "mixed"; entryId: string };

type PreviewFileMeta = {
  mimeType: string;
  imageOptions: {
    size: string;
    x: string;
    y: string;
  };
  videoOptions: {
    zoom: number;
    playbackRate: number;
    fade: number;
  };
};

let wallpaperUrls: string[] = [];
let wallpaperSolidColors: string[] = ["#171717"];
let selectedURLIndex = -1;
let selectedSolidColorIndex = -1;
let focusedFileId: string | null = null;
let focusedMixedEntryId: string | null = null;
let wallpaperGalleryRenderNonce = 0;
let wallpaperGallerySuppressClickUntil = 0;
let pendingWallpaperFileReplacement: PendingWallpaperFileReplacement | null = null;

const galleryItemClass =
  "group relative isolate aspect-video overflow-hidden rounded-md bg-neutral-900 cursor-pointer outline-none";
const galleryItemSelectedClass = "brightness-110";
const galleryMediaClass = "h-full w-full object-cover";
const galleryInnerClass = "h-full w-full overflow-hidden rounded-[4px]";
const galleryAddTileClass =
  "grid place-items-center text-2xl text-neutral-300 transition hover:bg-neutral-700 hover:text-white outline-none";
const galleryVideoBadgeClass =
  "absolute bottom-1.5 right-1.5 z-20 rounded-full bg-black/45 px-1.5 py-0.5 text-[10px] text-white";
const galleryHandleClass =
  "wallpaper-gallery-drag-handle absolute left-1.5 top-1.5 z-20 hidden h-7 w-7 place-items-center rounded-md bg-neutral-500 text-white transition hover:bg-neutral-600 group-hover:grid outline-none";
const galleryDeleteClass = "wallpaper-gallery-delete-button";
const galleryEditButtonClass = "wallpaper-gallery-edit-button";
const galleryTypeBadgeClass = `${galleryEditButtonClass} absolute bottom-1.5 left-1.5 z-20 hidden h-7 w-7 place-items-center rounded-md bg-neutral-500 text-white transition hover:bg-neutral-600 group-hover:grid outline-none`;

let wallpaperGalleryTooltipDelegate: Instance | null = null;
let wallpaperGallerySortable: Sortable | null = null;

const getScaledGalleryBlurValue = (rawBlur: string) => {
  const trimmed = rawBlur.trim();
  const match = trimmed.match(/^(-?\d*\.?\d+)\s*([a-z%]*)$/i);
  if (!match) return trimmed;

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) return trimmed;

  const unit = match[2] || "px";
  const scaled = Math.max(0, value / 2);
  return `${scaled}${unit}`;
};

const getGalleryMediaScaleValue = (rawBlur: string) => {
  const trimmed = rawBlur.trim();
  const match = trimmed.match(/^(-?\d*\.?\d+)\s*([a-z%]*)$/i);
  if (!match) return "scale(1)";

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) return "scale(1)";

  const unit = (match[2] || "px").toLowerCase();
  if (unit !== "px") return "scale(1)";

  const blurPx = Math.max(0, value / 2);
  if (blurPx <= 0) return "scale(1)";

  const scale = 1 + Math.min(0.12, blurPx * 0.01);
  return `scale(${scale})`;
};

const getGalleryFilterValue = () =>
  `brightness(${wallpaperFiltersBrightnessInputEl.value}) blur(${getScaledGalleryBlurValue(wallpaperFiltersBlurInputEl.value)})`;

const applyFiltersToGalleryMedia = () => {
  const filter = getGalleryFilterValue();
  const transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
  const mediaEls = wallpaperGalleryEl.querySelectorAll("img, video") as NodeListOf<HTMLElement>;
  mediaEls.forEach((el) => {
    el.style.filter = filter;
    el.style.transform = transform;
    el.style.transformOrigin = "center";
  });
};

const applyFiltersToDefaultPreviewMedia = () => {
  if (!wallpaperDefaultPreviewMediaEl) return;
  wallpaperDefaultPreviewMediaEl.style.filter = getGalleryFilterValue();
  wallpaperDefaultPreviewMediaEl.style.transform = getGalleryMediaScaleValue(
    wallpaperFiltersBlurInputEl.value
  );
  wallpaperDefaultPreviewMediaEl.style.transformOrigin = "center";
};

const createGalleryItem = (selected: boolean) => {
  const item = document.createElement("button");
  item.type = "button";
  item.className = `${galleryItemClass} wallpaper-gallery-item`;
  if (selected) item.classList.add(galleryItemSelectedClass);
  return item;
};

const getGalleryInnerContainer = (item: HTMLElement) => {
  const inner = document.createElement("div");
  inner.className = galleryInnerClass;
  item.appendChild(inner);
  return inner;
};

const addTileRepositionHandle = (item: HTMLElement) => {
  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = galleryHandleClass;
  handle.setAttribute("data-tippy-content", "reorder wallpaper");
  handle.innerHTML = '<i class="ri-draggable"></i>';

  handle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  item.appendChild(handle);
};

const addTileHoverOverlay = (item: HTMLElement) => {
  const overlay = document.createElement("div");
  overlay.className =
    "pointer-events-none absolute inset-0 z-10 bg-black/0 transition group-hover:bg-black/20";
  item.appendChild(overlay);
};

const addTileDeleteButton = (item: HTMLElement, onDelete: () => void) => {
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = `${galleryDeleteClass} absolute right-1.5 top-1.5 z-20 hidden h-7 w-7 place-items-center rounded-md bg-rose-500 text-white transition hover:bg-rose-600 group-hover:grid outline-none`;
  deleteButton.setAttribute("data-tippy-content", "delete wallpaper");
  deleteButton.innerHTML = '<i class="ri-delete-bin-line"></i>';

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete();
  });

  item.appendChild(deleteButton);
};

const openWallpaperFilePickerForAdd = () => {
  pendingWallpaperFileReplacement = null;
  wallpaperFileUploadInputEl.multiple = true;
  wallpaperFileUploadInputEl.click();
};

const openWallpaperFilePickerForReplacement = (replacement: PendingWallpaperFileReplacement) => {
  pendingWallpaperFileReplacement = replacement;
  wallpaperFileUploadInputEl.multiple = false;
  wallpaperFileUploadInputEl.click();
};

const addTileTypeBadge = (item: HTMLElement, type: EditableWallpaperType, onEdit: () => void) => {
  const badge = document.createElement("button");
  badge.type = "button";
  badge.className = galleryTypeBadgeClass;
  badge.setAttribute(
    "data-tippy-content",
    type === "url" ? "edit url" : type === "file-upload" ? "edit file-upload" : "edit solid-color"
  );

  const icon = document.createElement("i");

  if (type === "url") {
    icon.className = "ri-link-m text-sm";
  } else if (type === "file-upload") {
    icon.className = "ri-image-upload-line text-sm";
  } else {
    icon.className = "ri-palette-line text-sm";
  }

  badge.appendChild(icon);
  badge.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onEdit();
  });
  item.appendChild(badge);
};

const addSimpleAddTile = (renderNonce: number, onClick: () => void) => {
  const addTile = document.createElement("button");
  addTile.type = "button";
  addTile.className = `${galleryItemClass} ${galleryAddTileClass} wallpaper-gallery-add-tile`;
  addTile.innerHTML = '<i class="ri-add-line"></i>';
  addTile.addEventListener("click", () => {
    if (renderNonce !== wallpaperGalleryRenderNonce) return;
    onClick();
  });

  wallpaperGalleryEl.appendChild(addTile);
};

const addMixedAddTile = (renderNonce: number) => {
  const addTile = document.createElement("div");
  addTile.className = `${galleryItemClass} wallpaper-gallery-add-mixed-tile text-2xl text-neutral-300`;

  const segments: Array<{ icon: string; action: MixedAddAction; tooltip: string }> = [
    {
      icon: "ri-link",
      action: "url",
      tooltip: "add url"
    },
    {
      icon: "ri-image-upload-line",
      action: "file-upload",
      tooltip: "upload file"
    },
    {
      icon: "ri-palette-line",
      action: "solid-color",
      tooltip: "add solid color"
    }
  ];

  segments.forEach((segment) => {
    const segmentButton = document.createElement("button");
    segmentButton.type = "button";
    segmentButton.className = "wallpaper-gallery-add-mixed-segment";
    segmentButton.setAttribute("data-tippy-content", segment.tooltip);
    segmentButton.innerHTML = `<i class="${segment.icon}"></i>`;
    segmentButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (renderNonce !== wallpaperGalleryRenderNonce) return;
      void addMixedEntryForAction(segment.action);
    });

    addTile.appendChild(segmentButton);
  });

  wallpaperGalleryEl.appendChild(addTile);
};

const initWallpaperGalleryTooltips = () => {
  if (wallpaperGalleryTooltipDelegate) return;

  wallpaperGalleryTooltipDelegate = delegate(wallpaperGalleryEl, {
    target:
      ".wallpaper-gallery-drag-handle, .wallpaper-gallery-delete-button, .wallpaper-gallery-add-mixed-segment, .wallpaper-gallery-edit-button",
    placement: "top",
    theme: "dark",
    animation: "shift-away",
    duration: [120, 90],
    delay: [75, 0]
  });
};

const remapSelectedIndex = (selectedIndex: number, oldIndex: number, newIndex: number) => {
  if (selectedIndex < 0) return selectedIndex;
  if (selectedIndex === oldIndex) return newIndex;
  if (oldIndex < selectedIndex && selectedIndex <= newIndex) return selectedIndex - 1;
  if (newIndex <= selectedIndex && selectedIndex < oldIndex) return selectedIndex + 1;
  return selectedIndex;
};

const destroyWallpaperGallerySortable = () => {
  wallpaperGallerySortable?.destroy();
  wallpaperGallerySortable = null;
};

const shouldIgnoreGalleryClick = () => Date.now() < wallpaperGallerySuppressClickUntil;

const initWallpaperGallerySortable = (type: ActiveWallpaperType, renderNonce: number) => {
  destroyWallpaperGallerySortable();

  if (type === "default" || type === "random") return;

  wallpaperGallerySortable = new Sortable(wallpaperGalleryEl, {
    draggable: ".wallpaper-gallery-item",
    handle: ".wallpaper-gallery-drag-handle",
    fallbackOnBody: true,
    swapThreshold: 0.65,
    invertSwap: false,
    animation: 250,
    easing: "cubic-bezier(0.42, 0, 0.58, 1)",
    ghostClass: "wallpaper-gallery-ghost-class",
    chosenClass: "wallpaper-gallery-chosen-class",
    onStart: () => {
      wallpaperGallerySuppressClickUntil = Date.now() + 350;
    },
    onEnd: async ({ oldIndex, newIndex }) => {
      wallpaperGallerySuppressClickUntil = Date.now() + 350;
      if (renderNonce !== wallpaperGalleryRenderNonce) return;
      if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

      if (type === "url") {
        const [moved] = wallpaperUrls.splice(oldIndex, 1);
        if (!moved) return;
        wallpaperUrls.splice(newIndex, 0, moved);
        selectedURLIndex = remapSelectedIndex(selectedURLIndex, oldIndex, newIndex);
        return;
      }

      if (type === "solid-color") {
        const [moved] = wallpaperSolidColors.splice(oldIndex, 1);
        if (!moved) return;
        wallpaperSolidColors.splice(newIndex, 0, moved);
        selectedSolidColorIndex = remapSelectedIndex(selectedSolidColorIndex, oldIndex, newIndex);
        return;
      }

      if (type === "file-upload") {
        const orderedFileIds = Array.from(
          wallpaperGalleryEl.querySelectorAll(".wallpaper-gallery-item")
        )
          .map((item) => item.getAttribute("data-wallpaper-file-id"))
          .filter((id): id is string => typeof id === "string" && id.length > 0);

        await reorderUploadedWallpaperFiles(orderedFileIds);
        return;
      }

      if (type === "mixed") {
        const orderedEntryIds = Array.from(
          wallpaperGalleryEl.querySelectorAll(".wallpaper-gallery-item")
        )
          .map((item) => item.getAttribute("data-wallpaper-mixed-entry-id"))
          .filter((id): id is string => typeof id === "string" && id.length > 0);

        await reorderMixedWallpaperEntries(orderedEntryIds);
      }
    }
  });
};

const getActiveWallpaperType = (): ActiveWallpaperType => {
  const selected = getSelectedButton("wallpaper-type");

  if (!selected) return "default";
  if (selected.id === "wallpaper-type-url-button") return "url";
  if (selected.id === "wallpaper-type-file-upload-button") return "file-upload";
  if (selected.id === "wallpaper-type-random-button") return "random";
  if (selected.id === "wallpaper-type-solid-color-button") return "solid-color";
  if (selected.id === "wallpaper-type-mixed-button") return "mixed";
  return "default";
};

export const getWallpaperURLsFromState = () =>
  wallpaperUrls.map((url) => url.trim()).filter((url) => url.length > 0);

export const getWallpaperSolidColorsFromState = () =>
  wallpaperSolidColors.map((color) => color.trim()).filter((color) => color.length > 0);

export const setWallpaperURLsInState = (urls: string[]) => {
  wallpaperUrls = urls.filter((url) => typeof url === "string" && url.trim().length > 0);
  selectedURLIndex = wallpaperUrls.length > 0 ? 0 : -1;
};

export const setWallpaperSolidColorsInState = (colors: string[]) => {
  wallpaperSolidColors = colors.filter(
    (color) => typeof color === "string" && color.trim().length > 0
  );
  if (wallpaperSolidColors.length === 0) wallpaperSolidColors = ["#171717"];
  selectedSolidColorIndex = wallpaperSolidColors.length > 0 ? 0 : -1;
};

const applyFileMetaToPreview = (meta: PreviewFileMeta | undefined) => {
  if (!meta) return;

  const mediaEl = document.querySelector(
    "#live-wallpaper-preview img, #live-wallpaper-preview video"
  ) as HTMLImageElement | HTMLVideoElement | null;

  if (!mediaEl) return;

  if (mediaEl instanceof HTMLVideoElement || meta.mimeType.startsWith("video/")) {
    const videoEl = mediaEl as HTMLVideoElement;
    videoEl.playbackRate = meta.videoOptions.playbackRate;
    videoEl.style.transform = `scale(${meta.videoOptions.zoom})`;
    videoEl.style.transition = `opacity ${meta.videoOptions.fade}s linear`;
  } else {
    mediaEl.style.objectPosition = `${meta.imageOptions.x} ${meta.imageOptions.y}`;
    mediaEl.style.transform = `scale(${Number.parseInt(meta.imageOptions.size) / 100})`;
  }
};

const previewSelected = async () => {
  const type = getActiveWallpaperType();

  if (type === "url") {
    if (selectedURLIndex < 0 || !wallpaperUrls[selectedURLIndex]) {
      previewWallpaper(
        undefined,
        wallpaperFiltersBrightnessInputEl.value,
        wallpaperFiltersBlurInputEl.value
      );
      return;
    }

    previewWallpaper(
      wallpaperUrls[selectedURLIndex],
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
    return;
  }

  if (type === "solid-color") {
    if (selectedSolidColorIndex < 0 || !wallpaperSolidColors[selectedSolidColorIndex]) {
      previewWallpaperSolidColor("");
      return;
    }

    previewWallpaperSolidColor(wallpaperSolidColors[selectedSolidColorIndex]);
    return;
  }

  if (type === "file-upload") {
    if (!focusedFileId) {
      previewWallpaper(
        undefined,
        wallpaperFiltersBrightnessInputEl.value,
        wallpaperFiltersBlurInputEl.value
      );
      return;
    }

    const files = await listUploadedWallpaperFiles();
    const selectedMeta = files.find((file) => file.id === focusedFileId);
    const blob = await getUploadedWallpaperFile(focusedFileId);

    previewWallpaper(
      blob,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
    applyFileMetaToPreview(selectedMeta);
    return;
  }

  if (type === "mixed") {
    const [entries, files] = await Promise.all([
      listMixedWallpaperEntries(),
      listMixedUploadedWallpaperFiles()
    ]);

    if (!focusedMixedEntryId && entries[0]) {
      focusedMixedEntryId = entries[0].id;
    }

    const selectedEntry = entries.find((entry) => entry.id === focusedMixedEntryId);

    if (!selectedEntry) {
      previewWallpaper(
        undefined,
        wallpaperFiltersBrightnessInputEl.value,
        wallpaperFiltersBlurInputEl.value
      );
      return;
    }

    if (selectedEntry.kind === "url") {
      previewWallpaper(
        selectedEntry.value,
        wallpaperFiltersBrightnessInputEl.value,
        wallpaperFiltersBlurInputEl.value
      );
      return;
    }

    if (selectedEntry.kind === "solid-color") {
      previewWallpaperSolidColor(selectedEntry.value);
      return;
    }

    const selectedMeta = files.find((file) => file.id === selectedEntry.value);
    if (!selectedMeta) {
      previewWallpaper(
        undefined,
        wallpaperFiltersBrightnessInputEl.value,
        wallpaperFiltersBlurInputEl.value
      );
      return;
    }

    const blob = await getMixedUploadedWallpaperFile(selectedMeta.id);
    previewWallpaper(
      blob,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
    applyFileMetaToPreview(selectedMeta);
    return;
  }

  if (type === "random") {
    previewWallpaper(
      RANDOM_WALLPAPER_PREVIEW_URL,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
    return;
  }

  previewWallpaper("", wallpaperFiltersBrightnessInputEl.value, wallpaperFiltersBlurInputEl.value);
};

const addMixedEntryForAction = async (action: MixedAddAction) => {
  if (action === "url") {
    const value = await showInputDialog("Input wallpaper URL");
    if (!value) return;

    const added = await addMixedWallpaperURL(value);
    if (added) focusedMixedEntryId = added.id;
    await renderWallpaperGallery();
    return;
  }

  if (action === "solid-color") {
    const value = await showInputDialog("Input wallpaper color (e.g. #171717)");
    if (!value) return;

    const added = await addMixedWallpaperSolidColor(value);
    if (added) focusedMixedEntryId = added.id;
    await renderWallpaperGallery();
    return;
  }

  openWallpaperFilePickerForAdd();
};

export const addWallpaperForActiveType = async () => {
  const type = getActiveWallpaperType();

  if (type === "url") {
    const value = await showInputDialog("Input wallpaper URL");
    if (!value) return;

    const normalized = value.trim();
    if (!normalized) return;

    wallpaperUrls.push(normalized);
    selectedURLIndex = wallpaperUrls.length - 1;
    await renderWallpaperGallery();
    return;
  }

  if (type === "solid-color") {
    const value = await showInputDialog("Input wallpaper color (e.g. #171717)");
    if (!value) return;

    const normalized = value.trim();
    if (!normalized) return;

    wallpaperSolidColors.push(normalized);
    selectedSolidColorIndex = wallpaperSolidColors.length - 1;
    await renderWallpaperGallery();
    return;
  }

  if (type === "file-upload") {
    openWallpaperFilePickerForAdd();
    return;
  }

  if (type === "mixed") {
    await addMixedEntryForAction("url");
  }
};

const deleteURLAtIndex = async (index: number) => {
  if (index < 0 || index >= wallpaperUrls.length) return;

  wallpaperUrls.splice(index, 1);

  if (wallpaperUrls.length === 0) {
    selectedURLIndex = -1;
  } else {
    selectedURLIndex = Math.min(selectedURLIndex, wallpaperUrls.length - 1);
    if (selectedURLIndex < 0) selectedURLIndex = 0;
  }

  await renderWallpaperGallery();
};

const deleteSolidColorAtIndex = async (index: number) => {
  if (index < 0 || index >= wallpaperSolidColors.length) return;

  wallpaperSolidColors.splice(index, 1);

  if (wallpaperSolidColors.length === 0) {
    selectedSolidColorIndex = -1;
  } else {
    selectedSolidColorIndex = Math.min(selectedSolidColorIndex, wallpaperSolidColors.length - 1);
    if (selectedSolidColorIndex < 0) selectedSolidColorIndex = 0;
  }

  await renderWallpaperGallery();
};

const deleteUploadedFile = async (id: string) => {
  await removeUploadedWallpaperFiles([id]);

  if (focusedFileId === id) {
    const all = await listUploadedWallpaperFiles();
    focusedFileId = all[0]?.id ?? null;
  }

  await renderWallpaperGallery();
};

const deleteMixedEntry = async (id: string) => {
  await removeMixedWallpaperEntries([id]);

  if (focusedMixedEntryId === id) {
    const all = await listMixedWallpaperEntries();
    focusedMixedEntryId = all[0]?.id ?? null;
  }

  await renderWallpaperGallery();
};

const editURLAtIndex = async (index: number) => {
  if (index < 0 || index >= wallpaperUrls.length) return;

  const value = await showInputDialog("Edit wallpaper URL", {
    defaultValue: wallpaperUrls[index],
    confirmText: "save"
  });
  if (value == null) return;

  const normalized = value.trim();
  if (!normalized) return;

  wallpaperUrls[index] = normalized;
  selectedURLIndex = index;
  await renderWallpaperGallery();
};

const editSolidColorAtIndex = async (index: number) => {
  if (index < 0 || index >= wallpaperSolidColors.length) return;

  const value = await showInputDialog("Edit wallpaper color (e.g. #171717)", {
    defaultValue: wallpaperSolidColors[index],
    confirmText: "save"
  });
  if (value == null) return;

  const normalized = value.trim();
  if (!normalized) return;

  wallpaperSolidColors[index] = normalized;
  selectedSolidColorIndex = index;
  await renderWallpaperGallery();
};

const editMixedEntry = async (entry: {
  id: string;
  kind: EditableWallpaperType;
  value: string;
}) => {
  if (entry.kind === "file-upload") {
    openWallpaperFilePickerForReplacement({ scope: "mixed", entryId: entry.id });
    return;
  }

  const prompt =
    entry.kind === "url" ? "Edit wallpaper URL" : "Edit wallpaper color (e.g. #171717)";
  const value = await showInputDialog(prompt, {
    defaultValue: entry.value,
    confirmText: "save"
  });
  if (value == null) return;

  const updated = await updateMixedWallpaperEntryValue({
    entryId: entry.id,
    value
  });
  if (!updated) return;

  focusedMixedEntryId = updated.id;
  await renderWallpaperGallery();
};

const renderURLGallery = (renderNonce: number) => {
  wallpaperGalleryEl.innerHTML = "";

  wallpaperUrls.forEach((url, index) => {
    const item = createGalleryItem(index === selectedURLIndex);
    const inner = getGalleryInnerContainer(item);

    const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith("data:video/");

    if (isVideo) {
      const video = document.createElement("video");
      video.src = url;
      video.className = galleryMediaClass;
      video.style.filter = getGalleryFilterValue();
      video.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
      video.style.transformOrigin = "center";
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      inner.appendChild(video);

      const icon = document.createElement("span");
      icon.className = galleryVideoBadgeClass;
      icon.textContent = "video";
      item.appendChild(icon);
    } else {
      const img = document.createElement("img");
      img.src = url;
      img.className = galleryMediaClass;
      img.style.filter = getGalleryFilterValue();
      img.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
      img.style.transformOrigin = "center";
      inner.appendChild(img);
    }

    addTileRepositionHandle(item);
    addTileHoverOverlay(item);
    addTileDeleteButton(item, () => {
      void deleteURLAtIndex(index);
    });
    addTileTypeBadge(item, "url", () => {
      void editURLAtIndex(index);
    });

    item.addEventListener("click", () => {
      if (shouldIgnoreGalleryClick()) return;
      if (renderNonce !== wallpaperGalleryRenderNonce) return;
      selectedURLIndex = index;
      void renderWallpaperGallery();
    });

    wallpaperGalleryEl.appendChild(item);
  });

  addSimpleAddTile(renderNonce, () => {
    void addWallpaperForActiveType();
  });
};

const renderSolidColorGallery = (renderNonce: number) => {
  wallpaperGalleryEl.innerHTML = "";

  wallpaperSolidColors.forEach((color, index) => {
    const item = createGalleryItem(index === selectedSolidColorIndex);
    const inner = getGalleryInnerContainer(item);

    const solid = document.createElement("div");
    solid.className = "h-full w-full";
    solid.style.backgroundColor = color;

    inner.appendChild(solid);

    addTileRepositionHandle(item);
    addTileHoverOverlay(item);
    addTileDeleteButton(item, () => {
      void deleteSolidColorAtIndex(index);
    });
    addTileTypeBadge(item, "solid-color", () => {
      void editSolidColorAtIndex(index);
    });

    item.addEventListener("click", () => {
      if (shouldIgnoreGalleryClick()) return;
      if (renderNonce !== wallpaperGalleryRenderNonce) return;
      selectedSolidColorIndex = index;
      void renderWallpaperGallery();
    });

    wallpaperGalleryEl.appendChild(item);
  });

  addSimpleAddTile(renderNonce, () => {
    void addWallpaperForActiveType();
  });
};

const renderFileGallery = async (renderNonce: number) => {
  wallpaperGalleryEl.innerHTML = "";

  const files = await listUploadedWallpaperFiles();
  if (renderNonce !== wallpaperGalleryRenderNonce) return;

  if (!focusedFileId && files[0]) focusedFileId = files[0].id;

  const items = await Promise.all(
    files.map(async (file) => {
      const item = createGalleryItem(focusedFileId === file.id);
      item.setAttribute("data-wallpaper-file-id", file.id);
      const inner = getGalleryInnerContainer(item);

      const thumb = await getUploadedWallpaperThumbnail(file.id);

      if (thumb) {
        const url = URL.createObjectURL(thumb);

        if (file.mimeType.startsWith("video/")) {
          const video = document.createElement("video");
          video.src = url;
          video.className = galleryMediaClass;
          video.style.filter = getGalleryFilterValue();
          video.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
          video.style.transformOrigin = "center";
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          video.playsInline = true;
          inner.appendChild(video);

          const icon = document.createElement("span");
          icon.className = galleryVideoBadgeClass;
          icon.textContent = "video";
          item.appendChild(icon);
        } else {
          const img = document.createElement("img");
          img.src = url;
          img.className = galleryMediaClass;
          img.style.filter = getGalleryFilterValue();
          img.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
          img.style.transformOrigin = "center";
          inner.appendChild(img);
        }
      }

      addTileRepositionHandle(item);
      addTileHoverOverlay(item);
      addTileDeleteButton(item, () => {
        void deleteUploadedFile(file.id);
      });
      addTileTypeBadge(item, "file-upload", () => {
        openWallpaperFilePickerForReplacement({ scope: "file-upload", fileId: file.id });
      });

      item.addEventListener("click", () => {
        if (shouldIgnoreGalleryClick()) return;
        if (renderNonce !== wallpaperGalleryRenderNonce) return;
        focusedFileId = file.id;
        void renderWallpaperGallery();
      });

      return item;
    })
  );

  if (renderNonce !== wallpaperGalleryRenderNonce) return;

  items.forEach((item) => {
    wallpaperGalleryEl.appendChild(item);
  });

  addSimpleAddTile(renderNonce, () => {
    openWallpaperFilePickerForAdd();
  });
};

const appendMixedEntryMedia = async ({
  inner,
  entry,
  fileMeta
}: {
  inner: HTMLDivElement;
  entry: { kind: "url" | "solid-color" | "file-upload"; value: string };
  fileMeta?: MixedUploadedWallpaperFileMeta;
}) => {
  if (entry.kind === "solid-color") {
    const solid = document.createElement("div");
    solid.className = "h-full w-full";
    solid.style.backgroundColor = entry.value;
    inner.appendChild(solid);
    return;
  }

  if (entry.kind === "url") {
    const isVideo =
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(entry.value) || entry.value.startsWith("data:video/");

    if (isVideo) {
      const video = document.createElement("video");
      video.src = entry.value;
      video.className = galleryMediaClass;
      video.style.filter = getGalleryFilterValue();
      video.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
      video.style.transformOrigin = "center";
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      inner.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = entry.value;
      img.className = galleryMediaClass;
      img.style.filter = getGalleryFilterValue();
      img.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
      img.style.transformOrigin = "center";
      inner.appendChild(img);
    }

    return;
  }

  if (!fileMeta) return;

  const thumb = await getMixedUploadedWallpaperThumbnail(fileMeta.id);
  if (!thumb) return;

  const url = URL.createObjectURL(thumb);

  if (fileMeta.mimeType.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = url;
    video.className = galleryMediaClass;
    video.style.filter = getGalleryFilterValue();
    video.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
    video.style.transformOrigin = "center";
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    inner.appendChild(video);

    const icon = document.createElement("span");
    icon.className = galleryVideoBadgeClass;
    icon.textContent = "video";
    inner.parentElement?.appendChild(icon);
  } else {
    const img = document.createElement("img");
    img.src = url;
    img.className = galleryMediaClass;
    img.style.filter = getGalleryFilterValue();
    img.style.transform = getGalleryMediaScaleValue(wallpaperFiltersBlurInputEl.value);
    img.style.transformOrigin = "center";
    inner.appendChild(img);
  }
};

const renderMixedGallery = async (renderNonce: number) => {
  wallpaperGalleryEl.innerHTML = "";

  const [entries, files] = await Promise.all([
    listMixedWallpaperEntries(),
    listMixedUploadedWallpaperFiles()
  ]);

  if (renderNonce !== wallpaperGalleryRenderNonce) return;

  if (!focusedMixedEntryId && entries[0]) focusedMixedEntryId = entries[0].id;

  const fileMetaMap = new Map(files.map((file) => [file.id, file]));

  const items = await Promise.all(
    entries.map(async (entry) => {
      const item = createGalleryItem(focusedMixedEntryId === entry.id);
      item.setAttribute("data-wallpaper-mixed-entry-id", entry.id);
      const inner = getGalleryInnerContainer(item);

      await appendMixedEntryMedia({
        inner,
        entry,
        fileMeta: entry.kind === "file-upload" ? fileMetaMap.get(entry.value) : undefined
      });

      addTileRepositionHandle(item);
      addTileHoverOverlay(item);
      addTileDeleteButton(item, () => {
        void deleteMixedEntry(entry.id);
      });
      addTileTypeBadge(item, entry.kind, () => {
        void editMixedEntry(entry);
      });

      item.addEventListener("click", () => {
        if (shouldIgnoreGalleryClick()) return;
        if (renderNonce !== wallpaperGalleryRenderNonce) return;
        focusedMixedEntryId = entry.id;
        void renderWallpaperGallery();
      });

      return item;
    })
  );

  if (renderNonce !== wallpaperGalleryRenderNonce) return;

  items.forEach((item) => {
    wallpaperGalleryEl.appendChild(item);
  });

  addMixedAddTile(renderNonce);
};

const resetAllWallpapersForActiveType = async () => {
  const type = getActiveWallpaperType();

  if (type === "url") {
    wallpaperUrls = [];
    selectedURLIndex = -1;
    await renderWallpaperGallery();
    return;
  }

  if (type === "solid-color") {
    wallpaperSolidColors = [];
    selectedSolidColorIndex = -1;
    await renderWallpaperGallery();
    return;
  }

  if (type === "file-upload") {
    await resetUploadedWallpaperFiles();
    focusedFileId = null;
    await renderWallpaperGallery();
    return;
  }

  if (type === "mixed") {
    await resetMixedWallpaperEntries();
    focusedMixedEntryId = null;
    await renderWallpaperGallery();
  }
};

export const renderWallpaperGallery = async () => {
  initWallpaperGalleryTooltips();

  wallpaperGalleryRenderNonce += 1;
  const renderNonce = wallpaperGalleryRenderNonce;

  const type = getActiveWallpaperType();

  if (type === "default" || type === "random") {
    destroyWallpaperGallerySortable();
    wallpaperGalleryEl.style.display = "none";
    if (wallpaperGalleryWrapperEl) wallpaperGalleryWrapperEl.style.display = "none";
    if (wallpaperDefaultPreviewSectionEl) {
      wallpaperDefaultPreviewSectionEl.style.display = type === "default" ? "block" : "none";
    }
    if (wallpaperResetAllWrapperEl) wallpaperResetAllWrapperEl.style.display = "none";
  } else {
    wallpaperGalleryEl.style.display = "grid";
    if (wallpaperGalleryWrapperEl) wallpaperGalleryWrapperEl.style.display = "block";
    if (wallpaperDefaultPreviewSectionEl) wallpaperDefaultPreviewSectionEl.style.display = "none";
    if (wallpaperResetAllWrapperEl) wallpaperResetAllWrapperEl.style.display = "block";
  }

  if (type === "url") {
    renderURLGallery(renderNonce);
    initWallpaperGallerySortable(type, renderNonce);
  } else if (type === "solid-color") {
    renderSolidColorGallery(renderNonce);
    initWallpaperGallerySortable(type, renderNonce);
  } else if (type === "file-upload") {
    await renderFileGallery(renderNonce);
    initWallpaperGallerySortable(type, renderNonce);
  } else if (type === "mixed") {
    await renderMixedGallery(renderNonce);
    initWallpaperGallerySortable(type, renderNonce);
  } else {
    wallpaperGalleryEl.innerHTML = "";
  }

  if (renderNonce !== wallpaperGalleryRenderNonce) return;
  applyFiltersToDefaultPreviewMedia();
  await previewSelected();
};

export const handleWallpaperFileUpload = () => {
  wallpaperFileUploadInputEl.addEventListener("change", async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const files = input.files;
    const pendingReplacement = pendingWallpaperFileReplacement;

    if (!files || files.length === 0) {
      pendingWallpaperFileReplacement = null;
      input.multiple = true;
      return;
    }

    try {
      if (pendingReplacement) {
        const replacementFile = files[0];
        if (!replacementFile) return;

        if (pendingReplacement.scope === "file-upload") {
          const replaced = await replaceUploadedWallpaperFile({
            id: pendingReplacement.fileId,
            file: replacementFile
          });

          if (replaced) focusedFileId = replaced.id;
        } else {
          const replaced = await replaceMixedWallpaperEntryFile({
            entryId: pendingReplacement.entryId,
            file: replacementFile
          });

          if (replaced) focusedMixedEntryId = replaced.id;
        }

        await renderWallpaperGallery();
        return;
      }

      const type = getActiveWallpaperType();

      if (type === "mixed") {
        const addedEntries = await addMixedUploadedWallpaperFiles(files);
        focusedMixedEntryId = addedEntries[addedEntries.length - 1]?.id ?? focusedMixedEntryId;
      } else {
        await addUploadedWallpaperFiles(files);

        const all = await listUploadedWallpaperFiles();
        focusedFileId = all[all.length - 1]?.id ?? null;
      }

      await renderWallpaperGallery();
    } catch (err) {
      logger.log("Error storing wallpaper", err);
    } finally {
      pendingWallpaperFileReplacement = null;
      input.multiple = true;
      input.value = "";
    }
  });

  wallpaperResetAllButtonEl.onclick = () => {
    void showActionDialog(
      "do you want to reset all wallpapers for the selected type? this cannot be undone.",
      {
        cancelText: "cancel",
        actionText: "reset",
        onAction: async () => {
          await resetAllWallpapersForActiveType();
        }
      }
    );
  };
};

const getPreviewMediaEl = () =>
  document.querySelector("#live-wallpaper-preview img, #live-wallpaper-preview video") as
    | HTMLImageElement
    | HTMLVideoElement
    | null;

wallpaperFiltersBrightnessInputEl.onchange = () => {
  const mediaEl = getPreviewMediaEl();
  if (mediaEl) {
    applyWallpaperFilters(
      mediaEl,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
  }
  applyFiltersToGalleryMedia();
  applyFiltersToDefaultPreviewMedia();
};

wallpaperFiltersBlurInputEl.onchange = () => {
  const mediaEl = getPreviewMediaEl();
  if (mediaEl) {
    applyWallpaperFilters(
      mediaEl,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );
  }
  applyFiltersToGalleryMedia();
  applyFiltersToDefaultPreviewMedia();
};
