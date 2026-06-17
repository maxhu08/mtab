import {
  FONTAWESOME_BRANDS_LIST,
  FONTAWESOME_REGULAR_LIST,
  FONTAWESOME_SOLID_LIST
} from "~/src/options/scripts/utils/icons/fontawesome";
import { NERDFONTS_LIST } from "~/src/options/scripts/utils/icons/nerdfonts";
import { REMIXICONS_LIST } from "~/src/options/scripts/utils/icons/remixicons";
import { SIMPLEICONS_LIST } from "~/src/options/scripts/utils/icons/simpleicons";
import { createBookmarkIcon } from "~/src/utils/bookmark-icon";

type InputDialogOptions = {
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  defaultValue?: string;
};
type ActionDialogOptions = {
  cancelText?: string;
  actionText?: string;
  onAction: () => void | Promise<void>;
};

const OVERLAY_ID = "mtab-input-dialog-overlay";
const ACTION_OVERLAY_ID = "mtab-action-dialog-overlay";
const ICON_PICKER_OVERLAY_ID = "mtab-icon-picker-overlay";
const ICON_PICKER_RENDER_LIMIT = 100;
const ICON_PICKER_PREVIEW_COLOR = "currentColor";

type IconPickerItem = {
  name: string;
  value: string;
  search: string;
};

type IconPickerSection = {
  title: string;
  items: IconPickerItem[];
};

const ICON_PICKER_SECTIONS: IconPickerSection[] = [
  {
    title: "Remix Icon",
    items: REMIXICONS_LIST.map((name) => createIconPickerItem("remixicon", name, `ri-${name}`))
  },
  {
    title: "Font Awesome",
    items: [
      ...FONTAWESOME_BRANDS_LIST.map((name) =>
        createIconPickerItem("fontawesome brands", name, `fa-brands fa-${name}`)
      ),
      ...FONTAWESOME_REGULAR_LIST.map((name) =>
        createIconPickerItem("fontawesome regular", name, `fa-regular fa-${name}`)
      ),
      ...FONTAWESOME_SOLID_LIST.map((name) =>
        createIconPickerItem("fontawesome solid", name, `fa-solid fa-${name}`)
      )
    ]
  },
  {
    title: "Nerd Fonts",
    items: NERDFONTS_LIST.map((name) => createIconPickerItem("nerdfonts", name, `nf-${name}`))
  },
  {
    title: "Simple Icons",
    items: SIMPLEICONS_LIST.map((name) => createIconPickerItem("simpleicons", name, `si-${name}`))
  }
];

function createIconPickerItem(family: string, name: string, value: string): IconPickerItem {
  return {
    name,
    value,
    search: `${family} ${name} ${value}`.toLowerCase()
  };
}

export const showInputDialog = (
  text: string,
  options: InputDialogOptions = {}
): Promise<string | null> => {
  const existingOverlay = document.getElementById(OVERLAY_ID);
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.className =
    "fixed inset-0 z-[1000000000] grid place-items-center bg-black/60 p-4 backdrop-blur-sm";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 160ms ease";

  const dialog = document.createElement("div");
  dialog.className =
    "w-full max-w-xl rounded-md border-2 border-emerald-500 bg-neutral-900 p-4 text-base shadow-2xl";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", text);
  dialog.style.opacity = "0";
  dialog.style.transform = "translateY(8px) scale(0.96)";
  dialog.style.transition =
    "opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1)";

  const textEl = document.createElement("p");
  textEl.className = "mb-3 text-base text-white";
  textEl.textContent = text;

  const inputContainerEl = document.createElement("div");
  inputContainerEl.className =
    "w-full rounded-md border-2 border-transparent bg-neutral-800 p-1 text-base focus-within:border-sky-500";

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.autocomplete = "off";
  inputEl.className =
    "w-full bg-transparent text-base text-white placeholder-neutral-500 outline-none";
  inputEl.placeholder = options.placeholder ?? "paste here...";
  inputEl.value = options.defaultValue ?? "";
  inputContainerEl.append(inputEl);

  const actions = document.createElement("div");
  actions.className = "mt-4 grid grid-cols-2 gap-2";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className =
    "cursor-pointer rounded-md bg-neutral-800 px-3 py-2 text-base text-white transition hover:bg-neutral-700";
  cancelButton.textContent = options.cancelText ?? "cancel";

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className =
    "cursor-pointer rounded-md bg-emerald-500 px-3 py-2 text-base text-white transition hover:bg-emerald-600";
  confirmButton.textContent = options.confirmText ?? "ok";

  actions.append(cancelButton, confirmButton);
  dialog.append(textEl, inputContainerEl, actions);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    dialog.style.opacity = "1";
    dialog.style.transform = "translateY(0) scale(1)";
  });

  return new Promise((resolve) => {
    let isClosing = false;

    const cleanup = async () => {
      if (isClosing) return;
      isClosing = true;
      document.removeEventListener("keydown", onKeydown);
      overlay.style.opacity = "0";
      dialog.style.opacity = "0";
      dialog.style.transform = "translateY(8px) scale(0.96)";
      await new Promise((done) => setTimeout(done, 160));
      overlay.remove();
    };

    const submit = async () => {
      const value = inputEl.value;
      await cleanup();
      resolve(value);
    };

    const cancel = async () => {
      await cleanup();
      resolve(null);
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    };

    document.addEventListener("keydown", onKeydown);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) cancel();
    });
    cancelButton.addEventListener("click", cancel);
    confirmButton.addEventListener("click", submit);

    setTimeout(() => {
      inputEl.focus();
      inputEl.select();
    }, 0);
  });
};

export const showActionDialog = (text: string, options: ActionDialogOptions): Promise<boolean> => {
  const existingOverlay = document.getElementById(ACTION_OVERLAY_ID);
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = ACTION_OVERLAY_ID;
  overlay.className =
    "fixed inset-0 z-[1000000000] grid place-items-center bg-black/60 p-4 backdrop-blur-sm";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 160ms ease";

  const dialog = document.createElement("div");
  dialog.className =
    "w-full max-w-xl rounded-md border-2 border-rose-500 bg-neutral-900 p-4 text-base shadow-2xl";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", text);
  dialog.style.opacity = "0";
  dialog.style.transform = "translateY(8px) scale(0.96)";
  dialog.style.transition =
    "opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1)";

  const textEl = document.createElement("p");
  textEl.className = "text-base text-white";
  textEl.textContent = text;

  const actions = document.createElement("div");
  actions.className = "mt-4 grid grid-cols-2 gap-2";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className =
    "cursor-pointer rounded-md bg-neutral-800 px-3 py-2 text-base text-white transition hover:bg-neutral-700";
  cancelButton.textContent = options.cancelText ?? "cancel";

  const actionButton = document.createElement("button");
  actionButton.type = "button";
  actionButton.className =
    "cursor-pointer rounded-md bg-rose-500 px-3 py-2 text-base text-white transition hover:bg-rose-600";
  actionButton.textContent = options.actionText ?? "confirm";

  actions.append(cancelButton, actionButton);
  dialog.append(textEl, actions);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    dialog.style.opacity = "1";
    dialog.style.transform = "translateY(0) scale(1)";
  });

  return new Promise((resolve) => {
    let isClosing = false;

    const cleanup = async () => {
      if (isClosing) return;
      isClosing = true;
      document.removeEventListener("keydown", onKeydown);
      overlay.style.opacity = "0";
      dialog.style.opacity = "0";
      dialog.style.transform = "translateY(8px) scale(0.96)";
      await new Promise((done) => setTimeout(done, 160));
      overlay.remove();
    };

    const cancel = async () => {
      await cleanup();
      resolve(false);
    };

    const runAction = async () => {
      await cleanup();
      await options.onAction();
      resolve(true);
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        void cancel();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        void runAction();
      }
    };

    document.addEventListener("keydown", onKeydown);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) void cancel();
    });
    cancelButton.addEventListener("click", () => {
      void cancel();
    });
    actionButton.addEventListener("click", () => {
      void runAction();
    });
  });
};

export const showIconPickerModal = (currentValue = ""): Promise<string | null> => {
  const existingOverlay = document.getElementById(ICON_PICKER_OVERLAY_ID);
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = ICON_PICKER_OVERLAY_ID;
  overlay.className =
    "fixed inset-0 z-[1000000000] grid place-items-center bg-black/60 p-4 backdrop-blur-sm";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 160ms ease";

  const dialog = document.createElement("div");
  dialog.className =
    "grid max-h-[min(48rem,calc(100vh-2rem))] w-full max-w-6xl grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-3 rounded-md border-2 border-emerald-500 bg-neutral-900 p-4 text-base shadow-2xl";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Icon picker");
  dialog.style.opacity = "0";
  dialog.style.transform = "translateY(8px) scale(0.96)";
  dialog.style.transition =
    "opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1)";

  const headerEl = document.createElement("div");
  headerEl.className = "grid gap-1";

  const titleEl = document.createElement("p");
  titleEl.className = "text-base text-white";
  titleEl.textContent = "choose icon";

  const helperEl = document.createElement("p");
  helperEl.className = "text-sm text-neutral-500";
  helperEl.textContent = "Search by icon name, family, or full icon type.";

  headerEl.append(titleEl, helperEl);

  const searchContainerEl = document.createElement("div");
  searchContainerEl.className =
    "w-full rounded-md border-2 border-transparent bg-neutral-800 p-1 text-base focus-within:border-sky-500";

  const searchInputEl = document.createElement("input");
  searchInputEl.type = "text";
  searchInputEl.autocomplete = "off";
  searchInputEl.className =
    "w-full bg-transparent text-base text-white placeholder-neutral-500 outline-none";
  searchInputEl.placeholder = "search icons...";
  searchContainerEl.append(searchInputEl);

  const resultsEl = document.createElement("div");
  resultsEl.className = "options-icon-picker-results";

  const footerEl = document.createElement("div");
  footerEl.className = "grid gap-2";

  const countEl = document.createElement("p");
  countEl.className = "text-sm text-neutral-500";

  const actionsEl = document.createElement("div");
  actionsEl.className = "grid grid-cols-2 gap-2";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className =
    "cursor-pointer rounded-md bg-neutral-800 px-3 py-2 text-base text-white transition hover:bg-neutral-700";
  cancelButton.textContent = "cancel";

  const okButton = document.createElement("button");
  okButton.type = "button";
  okButton.className =
    "cursor-pointer rounded-md bg-emerald-500 px-3 py-2 text-base text-white transition hover:bg-emerald-600";
  okButton.textContent = "ok";

  actionsEl.append(cancelButton, okButton);
  footerEl.append(countEl, actionsEl);
  dialog.append(headerEl, searchContainerEl, resultsEl, footerEl);

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const previousBodyOverflow = document.body.style.overflow;
  const previousDocumentOverflow = document.documentElement.style.overflow;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    dialog.style.opacity = "1";
    dialog.style.transform = "translateY(0) scale(1)";
  });

  return new Promise((resolve) => {
    let isClosing = false;
    let selectedValue: string | null = currentValue || null;
    let lastTouchY: number | null = null;

    const cleanup = async (result: string | null) => {
      if (isClosing) return;
      isClosing = true;
      document.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      overlay.style.opacity = "0";
      dialog.style.opacity = "0";
      dialog.style.transform = "translateY(8px) scale(0.96)";
      await new Promise((done) => setTimeout(done, 160));
      overlay.remove();
      resolve(result);
    };

    const updateSelectedResult = () => {
      resultsEl
        .querySelectorAll<HTMLButtonElement>(".options-icon-picker-result")
        .forEach((button) => {
          button.classList.toggle("is-selected", button.dataset.iconValue === selectedValue);
        });
    };

    const selectIcon = (value: string) => {
      selectedValue = value;
      updateSelectedResult();
    };

    const renderResults = () => {
      const terms = searchInputEl.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const fragment = document.createDocumentFragment();
      const sectionMatches = ICON_PICKER_SECTIONS.map((section) => {
        const matches = terms.length
          ? section.items.filter((item) => terms.every((term) => item.search.includes(term)))
          : section.items;
        return { section, matches };
      }).filter((sectionMatch) => sectionMatch.matches.length > 0);
      const totalMatches = sectionMatches.reduce(
        (total, sectionMatch) => total + sectionMatch.matches.length,
        0
      );
      let totalVisible = 0;

      resultsEl.replaceChildren();

      for (const sectionMatch of sectionMatches) {
        const visibleMatches = sectionMatch.matches.slice(
          0,
          ICON_PICKER_RENDER_LIMIT - totalVisible
        );
        if (visibleMatches.length === 0) break;

        totalVisible += visibleMatches.length;

        const sectionEl = document.createElement("section");
        sectionEl.className = "options-icon-picker-section";

        const sectionHeaderEl = document.createElement("div");
        sectionHeaderEl.className = "options-icon-picker-section-header";

        const sectionTitleEl = document.createElement("h3");
        sectionTitleEl.className = "options-icon-picker-section-title";
        sectionTitleEl.textContent = sectionMatch.section.title;

        const sectionCountEl = document.createElement("span");
        sectionCountEl.className = "options-icon-picker-section-count";
        sectionCountEl.textContent = String(sectionMatch.matches.length);

        sectionHeaderEl.append(sectionTitleEl, sectionCountEl);

        const sectionGridEl = document.createElement("div");
        sectionGridEl.className = "options-icon-picker-section-grid";

        for (const item of visibleMatches) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "options-icon-picker-result";
          button.title = item.value;
          button.setAttribute("aria-label", item.value);

          button.dataset.iconValue = item.value;

          if (item.value === selectedValue) {
            button.classList.add("is-selected");
          }

          const iconWrapperEl = document.createElement("span");
          iconWrapperEl.className = "options-icon-picker-modal-icon";

          const icon = createBookmarkIcon(
            item.value,
            ICON_PICKER_PREVIEW_COLOR,
            ICON_PICKER_PREVIEW_COLOR
          );
          if (icon) iconWrapperEl.append(icon.iconEl);

          const nameEl = document.createElement("span");
          nameEl.className = "options-icon-picker-result-name";
          nameEl.textContent = item.name;

          button.append(iconWrapperEl, nameEl);
          button.addEventListener("click", () => {
            selectIcon(item.value);
          });

          sectionGridEl.append(button);
        }

        sectionEl.append(sectionHeaderEl, sectionGridEl);
        fragment.append(sectionEl);
      }

      resultsEl.append(fragment);

      if (totalMatches === 0) {
        countEl.textContent = "no icons found";
        return;
      }

      countEl.textContent =
        totalMatches > totalVisible
          ? `showing ${totalVisible} of ${totalMatches} icons; search to narrow results`
          : `showing ${totalMatches} icons`;
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        void cleanup(null);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        void cleanup(selectedValue);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (event.target instanceof Node && resultsEl.contains(event.target)) return;

      event.preventDefault();
      resultsEl.scrollBy({
        left: event.deltaX,
        top: event.deltaY
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.target instanceof Node && resultsEl.contains(event.target)) return;

      lastTouchY = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.target instanceof Node && resultsEl.contains(event.target)) return;

      const touchY = event.touches[0]?.clientY;
      if (typeof touchY !== "number" || lastTouchY === null) return;

      event.preventDefault();
      resultsEl.scrollBy({
        top: lastTouchY - touchY
      });
      lastTouchY = touchY;
    };

    const onTouchEnd = () => {
      lastTouchY = null;
    };

    document.addEventListener("keydown", onKeydown);
    overlay.addEventListener("wheel", onWheel, { passive: false });
    overlay.addEventListener("touchstart", onTouchStart, { passive: false });
    overlay.addEventListener("touchmove", onTouchMove, { passive: false });
    overlay.addEventListener("touchend", onTouchEnd);
    overlay.addEventListener("touchcancel", onTouchEnd);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) void cleanup(null);
    });
    cancelButton.addEventListener("click", () => {
      void cleanup(null);
    });
    okButton.addEventListener("click", () => {
      void cleanup(selectedValue);
    });
    searchInputEl.addEventListener("input", renderResults);

    renderResults();

    setTimeout(() => {
      searchInputEl.focus();
    }, 0);
  });
};