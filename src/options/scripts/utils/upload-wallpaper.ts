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
  UploadedWallpaperFileMeta,
  addUploadedWallpaperFiles,
  getUploadedWallpaperFile,
  getUploadedWallpaperThumbnail,
  listUploadedWallpaperFiles,
  reorderUploadedWallpaperFiles,
  removeUploadedWallpaperFiles,
  resetUploadedWallpaperFiles
} from "src/utils/wallpaper-file-storage";
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

let wallpaperUrls: string[] = [];
let wallpaperSolidColors: string[] = ["#171717"];
let selectedURLIndex = -1;
let selectedSolidColorIndex = -1;
let focusedFileId: string | null = null;
let wallpaperGalleryRenderNonce = 0;
let wallpaperGallerySuppressClickUntil = 0;

const galleryItemClass =
  "group relative aspect-video overflow-hidden rounded-md bg-neutral-900 cursor-pointer outline-none";
const galleryItemSelectedClass = "brightness-110";
const galleryMediaClass = "h-full w-full object-cover";
const galleryInnerClass = "h-full w-full overflow-hidden rounded-[4px]";
const galleryAddTileClass =
  "grid place-items-center text-2xl text-neutral-300 transition hover:bg-neutral-700 hover:text-white outline-none";
const galleryVideoBadgeClass =
  "absolute bottom-1.5 right-1.5 rounded-full bg-black/45 px-1.5 py-0.5 text-[10px] text-white";
const galleryHandleClass =
  "wallpaper-gallery-drag-handle absolute left-1.5 top-1.5 hidden h-7 w-7 place-items-center rounded-md bg-neutral-500 text-white transition hover:bg-neutral-600 group-hover:grid outline-none";
const galleryDeleteClass = "wallpaper-gallery-delete-button";

let wallpaperGalleryTooltipDelegate: Instance | null = null;

let wallpaperGallerySortable: Sortable | null = null;

const getGalleryFilterValue = () =>
  `brightness(${wallpaperFiltersBrightnessInputEl.value}) blur(${wallpaperFiltersBlurInputEl.value})`;

const applyFiltersToGalleryMedia = () => {
  const filter = getGalleryFilterValue();
  const mediaEls = wallpaperGalleryEl.querySelectorAll("img, video") as NodeListOf<HTMLElement>;
  mediaEls.forEach((el) => {
    el.style.filter = filter;
  });
};

const applyFiltersToDefaultPreviewMedia = () => {
  if (!wallpaperDefaultPreviewMediaEl) return;
  wallpaperDefaultPreviewMediaEl.style.filter = getGalleryFilterValue();
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
    "pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/20";
  item.appendChild(overlay);
};

const addTileDeleteButton = (item: HTMLElement, onDelete: () => void) => {
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = `${galleryDeleteClass} absolute right-1.5 top-1.5 hidden h-7 w-7 place-items-center rounded-md bg-rose-500 text-white transition hover:bg-rose-600 group-hover:grid outline-none`;
  deleteButton.setAttribute("data-tippy-content", "delete wallpaper");
  deleteButton.innerHTML = '<i class="ri-delete-bin-line"></i>';

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete();
  });

  item.appendChild(deleteButton);
};

const initWallpaperGalleryTooltips = () => {
  if (wallpaperGalleryTooltipDelegate) return;

  wallpaperGalleryTooltipDelegate = delegate(wallpaperGalleryEl, {
    target: ".wallpaper-gallery-drag-handle, .wallpaper-gallery-delete-button",
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

const initWallpaperGallerySortable = (
  type: ReturnType<typeof getActiveWallpaperType>,
  renderNonce: number
) => {
  destroyWallpaperGallerySortable();

  if (type === "default") return;

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
      }
    }
  });
};

const getActiveWallpaperType = () => {
  const selected = getSelectedButton("wallpaper-type");

  if (!selected) return "default";
  if (selected.id === "wallpaper-type-url-button") return "url";
  if (selected.id === "wallpaper-type-file-upload-button") return "file-upload";
  if (selected.id === "wallpaper-type-random-button") return "random";
  if (selected.id === "wallpaper-type-solid-color-button") return "solid-color";
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

const applyFileMetaToPreview = (meta: UploadedWallpaperFileMeta | undefined) => {
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
    wallpaperFileUploadInputEl.click();
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
      inner.appendChild(img);
    }

    addTileRepositionHandle(item);
    addTileHoverOverlay(item);
    addTileDeleteButton(item, () => {
      void deleteURLAtIndex(index);
    });

    item.addEventListener("click", () => {
      if (shouldIgnoreGalleryClick()) return;
      if (renderNonce !== wallpaperGalleryRenderNonce) return;
      selectedURLIndex = index;
      void renderWallpaperGallery();
    });

    wallpaperGalleryEl.appendChild(item);
  });

  const addTile = document.createElement("button");
  addTile.type = "button";
  addTile.className = `${galleryItemClass} ${galleryAddTileClass} wallpaper-gallery-add-tile`;
  addTile.innerHTML = '<i class="ri-add-line"></i>';
  addTile.addEventListener("click", () => {
    if (renderNonce !== wallpaperGalleryRenderNonce) return;
    void addWallpaperForActiveType();
  });
  wallpaperGalleryEl.appendChild(addTile);
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

    item.addEventListener("click", () => {
      if (shouldIgnoreGalleryClick()) return;
      if (renderNonce !== wallpaperGalleryRenderNonce) return;
      selectedSolidColorIndex = index;
      void renderWallpaperGallery();
    });

    wallpaperGalleryEl.appendChild(item);
  });

  const addTile = document.createElement("button");
  addTile.type = "button";
  addTile.className = `${galleryItemClass} ${galleryAddTileClass} wallpaper-gallery-add-tile`;
  addTile.innerHTML = '<i class="ri-add-line"></i>';
  addTile.addEventListener("click", () => {
    if (renderNonce !== wallpaperGalleryRenderNonce) return;
    void addWallpaperForActiveType();
  });
  wallpaperGalleryEl.appendChild(addTile);
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
          inner.appendChild(img);
        }
      }

      addTileRepositionHandle(item);
      addTileHoverOverlay(item);
      addTileDeleteButton(item, () => {
        void deleteUploadedFile(file.id);
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

  const addTile = document.createElement("button");
  addTile.type = "button";
  addTile.className = `${galleryItemClass} ${galleryAddTileClass} wallpaper-gallery-add-tile`;
  addTile.innerHTML = '<i class="ri-add-line"></i>';
  addTile.addEventListener("click", () => {
    if (renderNonce !== wallpaperGalleryRenderNonce) return;
    wallpaperFileUploadInputEl.click();
  });
  wallpaperGalleryEl.appendChild(addTile);
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

    if (!files || files.length === 0) return;

    try {
      await addUploadedWallpaperFiles(files);

      const all = await listUploadedWallpaperFiles();
      focusedFileId = all[all.length - 1]?.id ?? null;

      await renderWallpaperGallery();
    } catch (err) {
      logger.log("Error storing wallpaper", err);
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
