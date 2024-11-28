import { focusInput, unfocusInput } from "src/config-utils/scripts/handle";
import {
  BookmarksLocationFirefox,
  BookmarksType,
  Config,
  DefaultBlockyColorType,
  DefaultFaviconSource,
  UserDefinedBookmark
} from "src/newtab/scripts/config";
import {
  Input,
  bookmarksUserDefinedList,
  bookmarksTypeUserDefinedButtonEl,
  bookmarksTypeDefaultButtonEl,
  bookmarksTypeDefaultBlockyButtonEl,
  bookmarksTypeNoneButtonEl,
  bookmarksUserDefinedColsInputEl,
  bookmarksDefaultBlockyColsInputEl,
  bookmarksDefaultBlockyColorInputEl,
  bookmarksShowBookmarkNamesCheckboxEl,
  bookmarksLocationFirefoxMenuButtonEl,
  bookmarksLocationFirefoxToolbarButtonEl,
  bookmarksLocationFirefoxOtherButtonEl,
  bookmarksUserDefinedKeysCheckboxEl,
  bookmarksDefaultBlockyColorTypeRandomButtonEl,
  bookmarksDefaultBlockyColorTypeCustomButtonEl,
  bookmarksDefaultFaviconSourceGoogleButton,
  bookmarksDefaultFaviconSourceDuckduckgoButton
} from "src/options/scripts/ui";
import Sortable from "sortablejs";

export const fillBookmarksInputs = (config: Config) => {
  bookmarksShowBookmarkNamesCheckboxEl.checked = config.bookmarks.showBookmarkNames;

  bookmarksDefaultBlockyColsInputEl.value = config.bookmarks.defaultBlockyCols.toString();
  bookmarksDefaultBlockyColorInputEl.value = config.bookmarks.defaultBlockyColor;

  bookmarksUserDefinedKeysCheckboxEl.checked = config.bookmarks.userDefinedKeys;

  // prettier-ignore
  const bookmarksTypePairs: Record<BookmarksType, () => void> = {
    "user-defined": () => {
      bookmarksUserDefinedColsInputEl.value = config.bookmarks.userDefinedCols.toString();
      bookmarksTypeUserDefinedButtonEl.click();
    },
    "default": () => bookmarksTypeDefaultButtonEl.click(),
    "default-blocky": () => bookmarksTypeDefaultBlockyButtonEl.click(),
    "none": () => bookmarksTypeNoneButtonEl.click()
  };

  bookmarksTypePairs[config.bookmarks.type]();

  // user-defined bookmarks
  bookmarksUserDefinedList.innerHTML = "";
  config.bookmarks.userDefined.forEach((bookmark, index) => {
    addUserDefinedBookmark({ index, bookmark });
  });

  config.bookmarks.userDefined.forEach((_, index) => {
    handleBookmarkSettings(index);
  });

  toggleCollapseAllBookmarksButtonEl.click();

  const dropzone = document.getElementById("bookmarks-user-defined-list") as HTMLDivElement;
  new Sortable(dropzone, {
    handle: ".bookmark-node-handle",
    animation: 250,
    easing: "cubic-bezier(1, 0, 0, 1)",
    ghostClass: "bookmark-node-ghost-class",
    chosenClass: "bookmark-node-chosen-class"
  });

  // prettier-ignore
  const bookmarksDefaultBlockyColorTypePairs: Record<DefaultBlockyColorType, () => void> = {
    "random": () => bookmarksDefaultBlockyColorTypeRandomButtonEl.click(),
    "custom": () => bookmarksDefaultBlockyColorTypeCustomButtonEl.click(),
  };

  bookmarksDefaultBlockyColorTypePairs[config.bookmarks.defaultBlockyColorType]();

  // prettier-ignore
  const bookmarksLocationFirefoxPairs: Record<BookmarksLocationFirefox, () => void> = {
    "menu": () => bookmarksLocationFirefoxMenuButtonEl.click(),
    "toolbar": () => bookmarksLocationFirefoxToolbarButtonEl.click(),
    "other": () => bookmarksLocationFirefoxOtherButtonEl.click()
  };

  bookmarksLocationFirefoxPairs[config.bookmarks.bookmarksLocationFirefox]();

  // prettier-ignore
  const bookmarksDefaultFaviconSourcePairs: Record<DefaultFaviconSource, () => void> = {
    "google": () => bookmarksDefaultFaviconSourceGoogleButton.click(),
    "duckduckgo": () => bookmarksDefaultFaviconSourceDuckduckgoButton.click(),
  };

  bookmarksDefaultFaviconSourcePairs[config.bookmarks.defaultFaviconSource]();
};

// prettier-ignore
const handleBookmarkSettings = (index: number) => {
  // * handle focus stuff start
  const bookmarkInputBorderClass = "border-sky-500";

  const inputs: Input[] = [
    {
      container: document.getElementById(`bookmark-${index}-name-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-name-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${index}-url-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-url-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${index}-color-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-color-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${index}-icon-type-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-icon-type-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${index}-icon-color-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-icon-color-input`) as HTMLInputElement
    }
  ]

  inputs.forEach((input) => {
    input.input.addEventListener("blur", () =>
      unfocusInput({
        container: input.container,
        input: input.input,
        borderClassOld: bookmarkInputBorderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.input.addEventListener("focus", (e) =>
      focusInput({
        container: input.container,
        input: input.input,
        borderClassOld: "border-transparent",
        borderClassNew: bookmarkInputBorderClass,
        e
      })
    );

    input.input.addEventListener("input", () => {
      // fix bug where if you edit a bookmark and then add one it resets the previous one
      input.input.setAttribute("value", input.input.value);
    })
  });

  const deleteBookmarkButtonEl = document.getElementById(`bookmark-${index}-delete-button`) as HTMLButtonElement
  deleteBookmarkButtonEl.onclick = () => deleteBookmark(index);

  // prettier-ignore
  const collapsibleContentEl = document.getElementById(`bookmark-${index}-collapsible-content`) as HTMLDivElement
  // prettier-ignore
  const toggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${index}-toggle-collapse-button`) as HTMLButtonElement
  toggleCollapseBookmarkButtonEl.onclick = () => toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "toggle");
};

const deleteBookmark = (index: number) => {
  // prettier-ignore
  const bookmarkToDelete = document.getElementById(`bookmark-user-defined-item-${index}`) as HTMLDivElement;

  bookmarkToDelete.remove();
};

const toggleCollapseBookmark = (
  collapsibleContentEl: HTMLDivElement,
  toggleCollapseBookmarkButtonEl: HTMLButtonElement,
  mode: "toggle" | "collapse" | "expand"
) => {
  switch (mode) {
    case "toggle": {
      if (collapsibleContentEl.getAttribute("state") === "expanded") {
        collapsibleContentEl.setAttribute("state", "collapsed");
        collapsibleContentEl.classList.replace("grid", "hidden");

        toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-expand-horizontal-s-line"></i>`;
      } else if (collapsibleContentEl.getAttribute("state") === "collapsed") {
        collapsibleContentEl.setAttribute("state", "expanded");
        collapsibleContentEl.classList.replace("hidden", "grid");

        toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-collapse-horizontal-line"></i>`;
      }
      break;
    }
    case "collapse": {
      collapsibleContentEl.setAttribute("state", "collapsed");
      collapsibleContentEl.classList.replace("grid", "hidden");

      toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-expand-horizontal-s-line"></i>`;
      break;
    }
    case "expand": {
      collapsibleContentEl.setAttribute("state", "expanded");
      collapsibleContentEl.classList.replace("hidden", "grid");

      toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-collapse-horizontal-line"></i>`;
      break;
    }
  }
};

// prettier-ignore
const toggleCollapseAllBookmarksButtonEl = document.getElementById("bookmarks-user-defined-toggle-collapse-all-button") as HTMLButtonElement;

toggleCollapseAllBookmarksButtonEl.onclick = () => {
  const totalBookmarks = bookmarksUserDefinedList.children.length;

  const lastAction = toggleCollapseAllBookmarksButtonEl.getAttribute("last-action");

  for (let i = 0; i < totalBookmarks; i++) {
    // prettier-ignore
    const collapsibleContentEl = document.getElementById(`bookmark-${i}-collapsible-content`) as HTMLDivElement
    // prettier-ignore
    const toggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${i}-toggle-collapse-button`) as HTMLButtonElement

    switch (lastAction) {
      case "expand":
        toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "collapse");
        toggleCollapseAllBookmarksButtonEl.setAttribute("last-action", "collapse");
        toggleCollapseAllBookmarksButtonEl.innerHTML = `<span class="text-white text-base">expand all</span>`;
        break;
      case "collapse":
        toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "expand");
        toggleCollapseAllBookmarksButtonEl.setAttribute("last-action", "expand");
        toggleCollapseAllBookmarksButtonEl.innerHTML = `<span class="text-white text-base">collapse all</span>`;
        break;
    }
  }
};

(document.getElementById("bookmarks-user-defined-add-button") as HTMLButtonElement).onclick =
  () => {
    const totalBookmarks = bookmarksUserDefinedList.children.length;

    addUserDefinedBookmark({
      index: totalBookmarks,
      bookmark: {
        type: "bookmark",
        name: "NAME",
        url: "about:blank",
        color: "#84cc16",
        iconType: "ri-box-3-line",
        iconColor: "#ffffff"
      }
    });

    for (let i = 0; i <= totalBookmarks; i++) {
      handleBookmarkSettings(i);
    }
  };

const addUserDefinedBookmark = (params: { index: number; bookmark: UserDefinedBookmark }) => {
  const { index, bookmark } = params;

  bookmarksUserDefinedList.innerHTML += `
    <div id="bookmark-user-defined-item-${index}" class="bg-neutral-800 p-2 rounded-md grid grid-flow-row gap-4">
      <div class="grid grid-cols-[auto_max-content_max-content]">
        <span id="bookmark-${index}-user-defined-useless-title" class="text-white text-base my-auto">bookmarks.userDefined[${index}]</span>
        <div class="grid grid-cols-3 gap-2">
          <button id="bookmark-${index}-toggle-collapse-button" class="bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-collapse-horizontal-line"></i>
          </button>
          <button class="bookmark-node-handle bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-draggable"></i>
          </button>
          <button id="bookmark-${index}-delete-button" class="bg-rose-500 hover:bg-rose-600 transition w-10 aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-delete-bin-6-line"></i>
          </button>
        </div>
      </div>
      <div id="bookmark-${index}-collapsible-content" state="expanded" class="grid grid-flow-row gap-4">
        <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
        <div class="grid gap-2">
          <p class="text-white text-base">bookmark.name</p>
          <div
            id="bookmark-${index}-name-container"
            class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
            <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
            <input id="bookmark-${index}-name-input" type="text" autocomplete="off"
              class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input name..." value="${bookmark.name}">
          </div>
        </div>
        <div class="grid gap-2">
          <p class="text-white text-base">bookmark.url</p>
          <div
            id="bookmark-${index}-url-container"
            class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
            <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
            <input id="bookmark-${index}-url-input" type="text" autocomplete="off"
              class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input url..." value="${bookmark.url}">
          </div>
        </div>
        <div class="grid gap-2">
          <p class="text-white text-base">bookmark.color</p>
          <div
            id="bookmark-${index}-color-container"
            class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
            <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
            <input id="bookmark-${index}-color-input" type="text" autocomplete="off"
              class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input color..." value="${bookmark.color}">
          </div>
        </div>
        <div class="grid gap-2">
          <p class="text-white text-base">bookmark.iconType</p>
          <div
            id="bookmark-${index}-icon-type-container"
            class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
            <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
            <input id="bookmark-${index}-icon-type-input" type="text" autocomplete="off"
              class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input icon type..." value="${bookmark.iconType}">
          </div>
        </div>
        <div class="grid gap-2">
          <p class="text-white text-base">bookmark.iconColor</p>
          <div
            id="bookmark-${index}-icon-color-container"
            class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
            <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
            <input id="bookmark-${index}-icon-color-input" type="text" autocomplete="off"
              class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input icon type..." value="${bookmark.iconColor}">
          </div>
        </div>
      </div>
    </div>
    `;
};
