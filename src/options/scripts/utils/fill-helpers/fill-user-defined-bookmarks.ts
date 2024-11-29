import Sortable from "sortablejs";
import { focusInput, unfocusInput } from "src/config-utils/scripts/handle";
import { Config, UserDefinedBookmark, UserDefinedBookmarkFolder } from "src/newtab/scripts/config";
import { bookmarksUserDefinedList, Input } from "src/options/scripts/ui";
import { v4 as uuidv4 } from "uuid";

export const fillUserDefinedBookmarks = (config: Config) => {
  // user-defined bookmarks
  bookmarksUserDefinedList.innerHTML = "";
  config.bookmarks.userDefined.forEach((bookmark) => {
    addUserDefinedBookmark(bookmark);
  });

  const bookmarkNodeEls = bookmarksUserDefinedList.querySelectorAll('[node-type="bookmark"]');
  bookmarkNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;
    handleBookmarkSettings(uuid);
  });

  toggleCollapseAllBookmarksButtonEl.click();
};

export const handleUserDefinedBookmarkNodesDragging = () => {
  // prettier-ignore
  const dropzones = document.querySelectorAll(".bookmarks-user-defined-dropzone") as NodeListOf<HTMLDivElement>;

  dropzones.forEach((dropzone: HTMLDivElement) => {
    new Sortable(dropzone, {
      group: {
        name: "user-defined-bookmark-group",
        pull: true,
        put: true
      },
      fallbackOnBody: true,
      swapThreshold: 0.65,
      handle: ".bookmark-node-handle",
      animation: 250,
      easing: "cubic-bezier(1, 0, 0, 1)",
      ghostClass: "bookmark-node-ghost-class",
      chosenClass: "bookmark-node-chosen-class"
    });
  });
};

const handleBookmarkSettings = (uuid: string) => {
  // * handle focus stuff start
  const bookmarkInputBorderClass = "border-pink-500";

  const nameInput = document.getElementById(`bookmark-${uuid}-name-input`) as HTMLInputElement;
  const colorInput = document.getElementById(`bookmark-${uuid}-color-input`) as HTMLInputElement;
  // prettier-ignore
  const uselessTitle = document.getElementById(`bookmark-${uuid}-user-defined-useless-title`) as HTMLSpanElement;
  const accent = document.getElementById(`bookmark-${uuid}-user-defined-accent`) as HTMLDivElement;

  nameInput.addEventListener("input", () => {
    if (nameInput.value.length === 0) uselessTitle.textContent = "Untitled";
    else uselessTitle.textContent = nameInput.value;
  });

  colorInput.addEventListener("input", () => {
    accent.style.backgroundColor = colorInput.value;
  });

  const inputs: Input[] = [
    {
      container: document.getElementById(`bookmark-${uuid}-name-container`) as HTMLDivElement,
      input: nameInput
    },
    {
      container: document.getElementById(`bookmark-${uuid}-url-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${uuid}-url-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${uuid}-color-container`) as HTMLDivElement,
      input: colorInput
    },
    {
      container: document.getElementById(`bookmark-${uuid}-icon-type-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${uuid}-icon-type-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${uuid}-icon-color-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${uuid}-icon-color-input`) as HTMLInputElement
    }
  ];

  inputs.forEach((input) => {
    input.input.addEventListener("blur", () =>
      unfocusInput({
        container: input.container,
        input: input.input,
        borderClassOld: bookmarkInputBorderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.input.addEventListener("focus", (e: Event) =>
      focusInput({
        container: input.container,
        input: input.input,
        borderClassOld: "border-transparent",
        borderClassNew: bookmarkInputBorderClass,
        e
      })
    );
  });

  // prettier-ignore
  const deleteBookmarkButtonEl = document.getElementById(`bookmark-${uuid}-delete-button`) as HTMLButtonElement;
  deleteBookmarkButtonEl.onclick = () => deleteBookmark(uuid);

  // prettier-ignore
  const collapsibleContentEl = document.getElementById(`bookmark-${uuid}-collapsible-content`) as HTMLDivElement
  // prettier-ignore
  const toggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${uuid}-toggle-collapse-button`) as HTMLButtonElement
  // prettier-ignore
  toggleCollapseBookmarkButtonEl.onclick = () => toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "toggle");
};

const handleFolderSettings = (uuid: string) => {
  // * handle focus stuff start
  const bookmarkInputBorderClass = "border-pink-500";

  const nameInput = document.getElementById(`bookmark-${uuid}-name-input`) as HTMLInputElement;
  const colorInput = document.getElementById(`bookmark-${uuid}-color-input`) as HTMLInputElement;
  // prettier-ignore
  const uselessTitle = document.getElementById(`bookmark-${uuid}-user-defined-useless-title`) as HTMLSpanElement;
  const accent = document.getElementById(`bookmark-${uuid}-user-defined-accent`) as HTMLDivElement;

  nameInput.addEventListener("input", () => {
    if (nameInput.value.length === 0) uselessTitle.textContent = "Untitled";
    else uselessTitle.textContent = nameInput.value;
  });

  colorInput.addEventListener("input", () => {
    accent.style.backgroundColor = colorInput.value;
  });

  const inputs: Input[] = [
    {
      container: document.getElementById(`bookmark-${uuid}-name-container`) as HTMLDivElement,
      input: nameInput
    },
    {
      container: document.getElementById(`bookmark-${uuid}-color-container`) as HTMLDivElement,
      input: colorInput
    }
  ];

  inputs.forEach((input) => {
    input.input.addEventListener("blur", () =>
      unfocusInput({
        container: input.container,
        input: input.input,
        borderClassOld: bookmarkInputBorderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.input.addEventListener("focus", (e: Event) =>
      focusInput({
        container: input.container,
        input: input.input,
        borderClassOld: "border-transparent",
        borderClassNew: bookmarkInputBorderClass,
        e
      })
    );
  });

  // prettier-ignore
  const deleteBookmarkButtonEl = document.getElementById(`bookmark-${uuid}-delete-button`) as HTMLButtonElement;
  deleteBookmarkButtonEl.onclick = () => deleteBookmark(uuid);

  // prettier-ignore
  const collapsibleContentEl = document.getElementById(`bookmark-${uuid}-collapsible-content`) as HTMLDivElement
  // prettier-ignore
  const toggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${uuid}-toggle-collapse-button`) as HTMLButtonElement
  // prettier-ignore
  toggleCollapseBookmarkButtonEl.onclick = () => toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "toggle");
};

const deleteBookmark = (uuid: string) => {
  // prettier-ignore
  const bookmarkToDelete = document.querySelector(`[bookmark-node-uuid="${uuid}"]`) as HTMLDivElement;

  bookmarkToDelete.remove();
};

const toggleCollapseBookmark = (
  collapsibleContentEl: HTMLDivElement,
  toggleCollapseBookmarkButtonEl: HTMLButtonElement,
  mode: "toggle" | "collapse" | "expand"
) => {
  if (mode === "toggle") {
    if (collapsibleContentEl.getAttribute("state") === "expanded") {
      collapsibleContentEl.setAttribute("state", "collapsed");
      collapsibleContentEl.classList.replace("grid", "hidden");
      toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-expand-horizontal-s-line"></i>`;
    } else if (collapsibleContentEl.getAttribute("state") === "collapsed") {
      collapsibleContentEl.setAttribute("state", "expanded");
      collapsibleContentEl.classList.replace("hidden", "grid");
      toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-collapse-horizontal-line"></i>`;
    }
  } else if (mode === "collapse") {
    collapsibleContentEl.setAttribute("state", "collapsed");
    collapsibleContentEl.classList.replace("grid", "hidden");
    toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-expand-horizontal-s-line"></i>`;
  } else if (mode === "expand") {
    collapsibleContentEl.setAttribute("state", "expanded");
    collapsibleContentEl.classList.replace("hidden", "grid");
    toggleCollapseBookmarkButtonEl.innerHTML = `<i class="text-white ri-collapse-horizontal-line"></i>`;
  }
};

// prettier-ignore
const toggleCollapseAllBookmarksButtonEl = document.getElementById("bookmarks-user-defined-toggle-collapse-all-button") as HTMLButtonElement;
toggleCollapseAllBookmarksButtonEl.onclick = () => {
  const lastAction = toggleCollapseAllBookmarksButtonEl.getAttribute("last-action");
  const bookmarkNodeEls = bookmarksUserDefinedList.querySelectorAll('[node-type="bookmark"]');

  bookmarkNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid");

    // prettier-ignore
    const collapsibleContentEl = document.getElementById(`bookmark-${uuid}-collapsible-content`) as HTMLDivElement;
    // prettier-ignore
    const toggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${uuid}-toggle-collapse-button`) as HTMLButtonElement;

    if (lastAction === "expand") {
      toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "collapse");
      toggleCollapseAllBookmarksButtonEl.setAttribute("last-action", "collapse");
      toggleCollapseAllBookmarksButtonEl.innerHTML = `<span class="text-white text-base">expand all</span>`;
    } else if (lastAction === "collapse") {
      toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "expand");
      toggleCollapseAllBookmarksButtonEl.setAttribute("last-action", "expand");
      toggleCollapseAllBookmarksButtonEl.innerHTML = `<span class="text-white text-base">collapse all</span>`;
    }
  });
};

// prettier-ignore
const addBookmarkButtonEl = document.getElementById("bookmarks-user-defined-add-bookmark-button") as HTMLButtonElement;
// prettier-ignore
const addFolderButtonEl = document.getElementById("bookmarks-user-defined-add-folder-button") as HTMLButtonElement;

addBookmarkButtonEl.onclick = () => {
  const id = addUserDefinedBookmark({
    type: "bookmark",
    name: "New Bookmark",
    url: "about:blank",
    color: "#84cc16",
    iconType: "ri-box-3-line",
    iconColor: "#ffffff"
  });

  handleBookmarkSettings(id);
  bindToggleCollapseHandlers();
};

addFolderButtonEl.onclick = () => {
  const id = addUserDefinedBookmarkFolder({
    type: "folder",
    name: "New Folder",
    color: "#4d7c0f",
    contents: []
  });

  handleFolderSettings(id);
  bindToggleCollapseHandlers();
};

const bindToggleCollapseHandlers = () => {
  const bookmarkNodeEls = bookmarksUserDefinedList.querySelectorAll('[node-type="bookmark"]');
  bookmarkNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;

    // prettier-ignore
    const collapsibleContentEl = document.getElementById(`bookmark-${uuid}-collapsible-content`) as HTMLDivElement;
    // prettier-ignore
    const toggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${uuid}-toggle-collapse-button`) as HTMLButtonElement;

    toggleCollapseBookmarkButtonEl.onclick = () =>
      toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "toggle");
  });
};

const addUserDefinedBookmark = (bookmark: UserDefinedBookmark) => {
  const uuid = uuidv4();

  bookmarksUserDefinedList.innerHTML += `
    <div class="bookmark-user-defined-item bg-neutral-800 grid grid-cols-[max-content_auto] rounded-md overflow-hidden" node-type="bookmark" bookmark-node-uuid="${uuid}">
      <div id="bookmark-${uuid}-user-defined-accent" class="w-1 h-full" style="background-color:${bookmark.color};"></div>
      <div class="p-2 grid grid-flow-row gap-4">
        <div class="grid grid-cols-[auto_max-content_max-content]">
          <span id="bookmark-${uuid}-user-defined-useless-title" class="text-white text-base my-auto">${bookmark.name}</span>
          <div class="grid grid-cols-3 gap-2">
            <button id="bookmark-${uuid}-toggle-collapse-button" class="bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
              <i class="text-white ri-collapse-horizontal-line"></i>
            </button>
            <button class="bookmark-node-handle bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
              <i class="text-white ri-draggable"></i>
            </button>
            <button id="bookmark-${uuid}-delete-button" class="bg-rose-500 hover:bg-rose-600 transition w-10 aspect-square rounded-md cursor-pointer">
              <i class="text-white ri-delete-bin-6-line"></i>
            </button>
          </div>
        </div>
        <div id="bookmark-${uuid}-collapsible-content" state="expanded" class="grid grid-flow-row gap-4">
          <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
          <div class="grid gap-2">
            <p class="text-white text-base">bookmark.name</p>
            <div id="bookmark-${uuid}-name-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
              <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
              <input id="bookmark-${uuid}-name-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input name..." value="${bookmark.name}">
            </div>
          </div>
          <div class="grid gap-2">
            <p class="text-white text-base">bookmark.url</p>
            <div id="bookmark-${uuid}-url-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
              <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
              <input id="bookmark-${uuid}-url-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input url..." value="${bookmark.url}">
            </div>
          </div>
          <div class="grid gap-2">
            <p class="text-white text-base">bookmark.color</p>
            <div id="bookmark-${uuid}-color-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
              <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
              <input id="bookmark-${uuid}-color-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input color..." value="${bookmark.color}">
            </div>
          </div>
          <div class="grid gap-2">
            <p class="text-white text-base">bookmark.iconType</p>
            <div id="bookmark-${uuid}-icon-type-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
              <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
              <input id="bookmark-${uuid}-icon-type-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input icon type..." value="${bookmark.iconType}">
            </div>
          </div>
          <div class="grid gap-2">
            <p class="text-white text-base">bookmark.iconColor</p>
            <div id="bookmark-${uuid}-icon-color-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
              <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
              <input id="bookmark-${uuid}-icon-color-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input icon color..." value="${bookmark.iconColor}">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return uuid;
};

const addUserDefinedBookmarkFolder = (folder: UserDefinedBookmarkFolder) => {
  const uuid = uuidv4();

  bookmarksUserDefinedList.innerHTML += `
    <div class="bookmark-user-defined-item bg-neutral-800 grid grid-cols-[max-content_auto] rounded-md overflow-hidden" node-type="bookmark" bookmark-node-uuid="${uuid}">
      <div id="bookmark-${uuid}-user-defined-accent" class="w-1 h-full" style="background-color:${folder.color};"></div>
      <div class="p-2 grid grid-flow-row gap-4">
        <div class="grid grid-cols-[auto_max-content_max-content]">
          <span id="bookmark-${uuid}-user-defined-useless-title" class="text-white text-base my-auto">${folder.name}</span>
          <div class="grid grid-cols-3 gap-2">
            <button id="bookmark-${uuid}-toggle-collapse-button" class="bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
              <i class="text-white ri-collapse-horizontal-line"></i>
            </button>
            <button class="bookmark-node-handle bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
              <i class="text-white ri-draggable"></i>
            </button>
            <button id="bookmark-${uuid}-delete-button" class="bg-rose-500 hover:bg-rose-600 transition w-10 aspect-square rounded-md cursor-pointer">
              <i class="text-white ri-delete-bin-6-line"></i>
            </button>
          </div>
        </div>
        <div id="bookmark-${uuid}-collapsible-content" state="expanded" class="grid grid-flow-row gap-4">
          <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
          <div class="grid gap-2">
            <p class="text-white text-base">folder.name</p>
            <div id="bookmark-${uuid}-name-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
              <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
              <input id="bookmark-${uuid}-name-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input name..." value="${folder.name}">
            </div>
          </div>
          <div class="grid gap-2">
            <p class="text-white text-base">folder.color</p>
            <div id="bookmark-${uuid}-color-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
              <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
              <input id="bookmark-${uuid}-color-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input color..." value="${folder.color}">
            </div>
          </div>
          <div class="grid gap-2">
            <p class="text-white text-base">folder.contents</p>
            <div id="bookmark-${uuid}-contents-container" class="bookmarks-user-defined-dropzone grid grid-flow-row gap-2 bg-neutral-900 rounded-md p-4 min-h-14"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  handleUserDefinedBookmarkNodesDragging();
  return uuid;
};
