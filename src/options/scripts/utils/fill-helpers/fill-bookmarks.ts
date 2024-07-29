import { Config, UserDefinedBookmark } from "src/newtab/scripts/config";
import { focusInput, unfocusInput } from "src/options/scripts/inputs";
import {
  Input,
  bookmarksUserDefinedList,
  bookmarksTypeDefaultButtonEl,
  bookmarksTypeNoneButtonEl,
  bookmarksTypeUserDefinedButtonEl
} from "src/options/scripts/ui";

export const fillBookmarksInputs = (config: Config) => {
  switch (config.bookmarks.type) {
    case "default": {
      bookmarksTypeDefaultButtonEl.click();
      break;
    }
    case "user-defined": {
      bookmarksTypeUserDefinedButtonEl.click();
      break;
    }
    case "none": {
      bookmarksTypeNoneButtonEl.click();
      break;
    }
  }

  // user-defined bookmarks
  bookmarksUserDefinedList.innerHTML = "";
  config.bookmarks.userDefined.forEach((bookmark, index) => {
    addUserDefinedBookmark({ index, bookmark });
  });

  config.bookmarks.userDefined.forEach((_, index) => {
    handleBookmarkSettings(index);
  });
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
  // * handle focus stuff end

  const deleteBookmarkButtonEl = document.getElementById(`bookmark-${index}-delete-button`) as HTMLButtonElement
  deleteBookmarkButtonEl.addEventListener("click", () => {
    const bookmarkToDelete = document.getElementById(`bookmark-user-defined-item-${index}`) as HTMLDivElement;
    const totalBookmarks = bookmarksUserDefinedList.children.length;
    
    // fix to make saving work normally
    for (let i = index + 1; i < totalBookmarks; i++) {
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
    }

    bookmarkToDelete.parentNode!.removeChild(bookmarkToDelete);
  })
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
        <span id="bookmark-${index}-user-defined-useless-title" class="text-white text-base">bookmarks.userDefined[${index}]</span>
        <div class="grid grid-cols-2 gap-2">
          <button id="bookmark-${index}-toggle-collapse-button" class="bg-neutral-500 hover:bg-neutral-600 transition aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-collapse-horizontal-line"></i>
          </button>
          <button id="bookmark-${index}-delete-button" class="bg-rose-500 hover:bg-rose-600 transition aspect-square rounded-md cursor-pointer">
            <i class="text-white ri-delete-bin-6-line"></i>
          </button>
        </div>
      </div>
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
    `;
};
