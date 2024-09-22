import {
  BookmarksLocationFirefox,
  BookmarksType,
  Config,
  UserDefinedBookmark
} from "src/newtab/scripts/config";
import { focusInput, unfocusInput } from "src/options/scripts/inputs";
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
  bookmarksUserDefinedKeysCheckboxEl
} from "src/options/scripts/ui";

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

  // prettier-ignore
  const bookmarksLocationFirefoxPairs: Record<BookmarksLocationFirefox, () => void> = {
    "menu": () => bookmarksLocationFirefoxMenuButtonEl.click(),
    "toolbar": () => bookmarksLocationFirefoxToolbarButtonEl.click(),
    "other": () => bookmarksLocationFirefoxOtherButtonEl.click()
  };

  bookmarksLocationFirefoxPairs[config.bookmarks.bookmarksLocationFirefox]();
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

  const pushBookmarkUpButtenEl = document.getElementById(`bookmark-${index}-push-up-button`) as HTMLButtonElement
  const pushBookmarkDownButtenEl = document.getElementById(`bookmark-${index}-push-down-button`) as HTMLButtonElement

  pushBookmarkUpButtenEl.onclick = () => pushBookmark(index, "up");
  pushBookmarkDownButtenEl.onclick = () => pushBookmark(index, "down");
};

// prettier-ignore
const deleteBookmark = (index: number) => {
  const bookmarkToDelete = document.getElementById(`bookmark-user-defined-item-${index}`) as HTMLDivElement;

  const totalBookmarks = bookmarksUserDefinedList.children.length;
  
  // fix to make saving work normally
  for (let i = index + 1; i < totalBookmarks; i++) {
    const userDefinedItemEl = document.getElementById(`bookmark-user-defined-item-${i}`) as HTMLDivElement;
    const oldUselessTitle = document.getElementById(`bookmark-${i}-user-defined-useless-title`) as HTMLSpanElement;

    const oldNameInputEl = document.getElementById(`bookmark-${i}-name-input`) as HTMLInputElement;
    const oldUrlInputEl = document.getElementById(`bookmark-${i}-url-input`) as HTMLInputElement;
    const oldColorInputEl = document.getElementById(`bookmark-${i}-color-input`) as HTMLInputElement;
    const oldIconTypeInputEl = document.getElementById(`bookmark-${i}-icon-type-input`) as HTMLInputElement;
    const oldIconColorInputEl = document.getElementById(`bookmark-${i}-icon-color-input`) as HTMLInputElement;

    const oldNameContainerEl = document.getElementById(`bookmark-${i}-name-container`) as HTMLInputElement;
    const oldUrlContainerEl = document.getElementById(`bookmark-${i}-url-container`) as HTMLInputElement;
    const oldColorContainerEl = document.getElementById(`bookmark-${i}-color-container`) as HTMLInputElement;     
    const oldIconTypeContainerEl = document.getElementById(`bookmark-${i}-icon-type-container`) as HTMLInputElement;
    const oldIconColorContainerEl = document.getElementById(`bookmark-${i}-icon-color-container`) as HTMLInputElement;

    const oldCollapsibleContentEl = document.getElementById(`bookmark-${i}-collapsible-content`) as HTMLDivElement
    const oldToggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${i}-toggle-collapse-button`) as HTMLButtonElement

    const oldPushUpButtonEl = document.getElementById(`bookmark-${i}-push-up-button`) as HTMLButtonElement;
    const oldPushDownButtonEl = document.getElementById(`bookmark-${i}-push-down-button`) as HTMLButtonElement;
    const oldDeleteButtonEl = document.getElementById(`bookmark-${i}-delete-button`) as HTMLButtonElement;

    userDefinedItemEl.id = `bookmark-user-defined-item-${i - 1}`

    oldUselessTitle.id = `bookmark-${i - 1}-user-defined-useless-title`
    oldUselessTitle.textContent = `bookmarks.userDefined[${i - 1}]`

    oldNameInputEl.id = `bookmark-${i - 1}-name-input`;
    oldUrlInputEl.id = `bookmark-${i - 1}-url-input`;
    oldColorInputEl.id = `bookmark-${i - 1}-color-input`;
    oldIconTypeInputEl.id = `bookmark-${i - 1}-icon-type-input`;
    oldIconColorInputEl.id = `bookmark-${i - 1}-icon-color-input`

    oldNameContainerEl.id = `bookmark-${i - 1}-name-container`;
    oldUrlContainerEl.id = `bookmark-${i - 1}-url-container`;
    oldColorContainerEl.id = `bookmark-${i - 1}-color-container`;
    oldIconTypeContainerEl.id = `bookmark-${i - 1}-icon-type-container`;
    oldIconColorContainerEl.id = `bookmark-${i - 1}-icon-color-container`;

    oldCollapsibleContentEl.id = `bookmark-${i - 1}-collapsible-content`;
    oldToggleCollapseBookmarkButtonEl.id  = `bookmark-${i - 1}-toggle-collapse-button`;

    oldPushUpButtonEl.id = `bookmark-${i - 1}-push-up-button`;
    oldPushDownButtonEl.id = `bookmark-${i - 1}-push-down-button`;
    oldDeleteButtonEl.id = `bookmark-${i - 1}-delete-button`;

    oldPushUpButtonEl.onclick = () => pushBookmark(index, "up");
    oldPushDownButtonEl.onclick = () => pushBookmark(index, "down");
    oldDeleteButtonEl.onclick = () => deleteBookmark(index);
  }

  bookmarkToDelete.parentNode!.removeChild(bookmarkToDelete);
}

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
const pushBookmark = (index: number, direction: "up" | "down") => {
  const totalBookmarks = bookmarksUserDefinedList.children.length;

  if (index === 0 && direction === "up") return;
  else if (index === totalBookmarks - 1 && direction === "down") return;

  const currBookmarkNameInputEl = document.getElementById(`bookmark-${index}-name-input`) as HTMLInputElement;
  const currBookmarkUrlInputEl = document.getElementById(`bookmark-${index}-url-input`) as HTMLInputElement;
  const currBookmarkColorInputEl = document.getElementById(`bookmark-${index}-color-input`) as HTMLInputElement;
  const currBookmarkIconTypeInputEl = document.getElementById(`bookmark-${index}-icon-type-input`) as HTMLInputElement;
  const currBookmarkIconColorInputEl = document.getElementById(`bookmark-${index}-icon-color-input`) as HTMLInputElement;

  const currBookmarkData: UserDefinedBookmark = {
    name: currBookmarkNameInputEl.value,
    url: currBookmarkUrlInputEl.value,
    color: currBookmarkColorInputEl.value,
    iconType: currBookmarkIconTypeInputEl.value,
    iconColor: currBookmarkIconColorInputEl.value
  };

  let swapBookmarkData: UserDefinedBookmark = { name: "N/A", url: "N/A", color: "N/A", iconType: "N/A", iconColor: "N/A" };
  let swapBookmarkNameInputEl: HTMLInputElement;
  let swapBookmarkUrlInputEl: HTMLInputElement;
  let swapBookmarkColorInputEl: HTMLInputElement;
  let swapBookmarkIconTypeInputEl: HTMLInputElement;
  let swapBookmarkIconColorInputEl: HTMLInputElement;

  if (direction === "up") {
    swapBookmarkNameInputEl = document.getElementById(`bookmark-${index - 1}-name-input`) as HTMLInputElement;
    swapBookmarkUrlInputEl = document.getElementById(`bookmark-${index - 1}-url-input`) as HTMLInputElement;
    swapBookmarkColorInputEl = document.getElementById(`bookmark-${index - 1}-color-input`) as HTMLInputElement;
    swapBookmarkIconTypeInputEl = document.getElementById(`bookmark-${index - 1}-icon-type-input`) as HTMLInputElement;
    swapBookmarkIconColorInputEl = document.getElementById(`bookmark-${index - 1}-icon-color-input`) as HTMLInputElement;

    swapBookmarkData = {
      name: swapBookmarkNameInputEl.value,
      url: swapBookmarkUrlInputEl.value,
      color: swapBookmarkColorInputEl.value,
      iconType: swapBookmarkIconTypeInputEl.value,
      iconColor: swapBookmarkIconColorInputEl.value
    };
  } else if (direction === "down") {
    swapBookmarkNameInputEl = document.getElementById(`bookmark-${index + 1}-name-input`) as HTMLInputElement;
    swapBookmarkUrlInputEl = document.getElementById(`bookmark-${index + 1}-url-input`) as HTMLInputElement;
    swapBookmarkColorInputEl = document.getElementById(`bookmark-${index + 1}-color-input`) as HTMLInputElement;
    swapBookmarkIconTypeInputEl = document.getElementById(`bookmark-${index + 1}-icon-type-input`) as HTMLInputElement;
    swapBookmarkIconColorInputEl = document.getElementById(`bookmark-${index + 1}-icon-color-input`) as HTMLInputElement;

    swapBookmarkData = {
      name: swapBookmarkNameInputEl.value,
      url: swapBookmarkUrlInputEl.value,
      color: swapBookmarkColorInputEl.value,
      iconType: swapBookmarkIconTypeInputEl.value,
      iconColor: swapBookmarkIconColorInputEl.value
    };
  }

  currBookmarkNameInputEl.value = swapBookmarkData.name;
  currBookmarkUrlInputEl.value = swapBookmarkData.url;
  currBookmarkColorInputEl.value = swapBookmarkData.color;
  currBookmarkIconTypeInputEl.value = swapBookmarkData.iconType;
  currBookmarkIconColorInputEl.value = swapBookmarkData.iconColor;

  swapBookmarkNameInputEl!.value = currBookmarkData.name;
  swapBookmarkUrlInputEl!.value = currBookmarkData.url;
  swapBookmarkColorInputEl!.value = currBookmarkData.color;
  swapBookmarkIconTypeInputEl!.value = currBookmarkData.iconType;
  swapBookmarkIconColorInputEl!.value = currBookmarkData.iconColor;
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
        <div class="grid grid-cols-4 gap-2">
          <button id="bookmark-${index}-toggle-collapse-button" class="bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-collapse-horizontal-line"></i>
          </button>
          <button id="bookmark-${index}-push-up-button" class="bg-cyan-500 hover:bg-cyan-600 transition w-10 aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-arrow-up-line"></i>
          </button>
          <button id="bookmark-${index}-push-down-button" class="bg-cyan-500 hover:bg-cyan-600 transition w-10 aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-arrow-down-line"></i>
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
