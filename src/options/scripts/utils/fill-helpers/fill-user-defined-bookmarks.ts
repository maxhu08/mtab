import Sortable from "sortablejs";
import { focusInput, unfocusInput } from "src/config-utils/scripts/handle";
import { Config, BookmarkNodeBookmark, BookmarkNodeFolder } from "src/utils/config";
import { bookmarksUserDefinedList, Input } from "src/options/scripts/ui";
import { getRandomColor } from "src/options/scripts/utils/random-color";
import { genid } from "src/utils/genid";

export const fillBookmarkNodeBookmarks = (config: Config) => {
  // user-defined bookmarks
  bookmarksUserDefinedList.innerHTML = "";
  config.bookmarks.userDefined.forEach((bookmarkNode) => {
    if (bookmarkNode.type === "bookmark")
      addBookmarkNodeBookmark(bookmarkNode, bookmarksUserDefinedList);
    else if (bookmarkNode.type === "folder")
      addBookmarkNodeFolder(
        {
          ...bookmarkNode,
          iconType: bookmarkNode.iconType
        },
        bookmarksUserDefinedList
      );
  });

  const bookmarkNodeEls = bookmarksUserDefinedList.querySelectorAll('[node-type="bookmark"]');
  bookmarkNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;
    handleBookmarkSettings(uuid);
  });

  toggleCollapseAllBookmarkNodesButtonEl.click();
};

export const handleBookmarkNodesDragging = () => {
  // prettier-ignore
  const dropzones = document.querySelectorAll(".bookmarks-user-defined-dropzone") as NodeListOf<HTMLDivElement>;

  dropzones.forEach((dropzone: HTMLDivElement) => {
    // Reset the sortable instance
    if (dropzone.dataset.sortableInitialized === "true") {
      // Destroy the existing sortable instance (if any)
      const sortableInstance = (dropzone as any).sortable;
      if (sortableInstance) {
        sortableInstance.destroy();
      }
    }

    // Reinitialize the sortable instance
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
      easing: "cubic-bezier(0.42, 0, 0.58, 1)",
      ghostClass: "bookmark-node-ghost-class",
      chosenClass: "bookmark-node-chosen-class"
    });

    dropzone.dataset.sortableInitialized = "true";
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
  const iconTypeInput = document.getElementById(
    `bookmark-${uuid}-icon-type-input`
  ) as HTMLInputElement;
  const iconColorInput = document.getElementById(
    `bookmark-${uuid}-icon-color-input`
  ) as HTMLInputElement;
  const fillInput = document.getElementById(`bookmark-${uuid}-fill-input`) as HTMLInputElement;
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
    },
    {
      container: document.getElementById(`bookmark-${uuid}-icon-type-container`) as HTMLDivElement,
      input: iconTypeInput
    },
    {
      container: document.getElementById(`bookmark-${uuid}-icon-color-container`) as HTMLDivElement,
      input: iconColorInput
    },
    {
      container: document.getElementById(`bookmark-${uuid}-fill-container`) as HTMLDivElement,
      input: fillInput
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
      toggleCollapseBookmarkButtonEl.children[0].className =
        "text-white ri-expand-horizontal-s-line";
    } else if (collapsibleContentEl.getAttribute("state") === "collapsed") {
      collapsibleContentEl.setAttribute("state", "expanded");
      collapsibleContentEl.classList.replace("hidden", "grid");
      toggleCollapseBookmarkButtonEl.children[0].className =
        "text-white ri-collapse-horizontal-line";
    }
  } else if (mode === "collapse") {
    collapsibleContentEl.setAttribute("state", "collapsed");
    collapsibleContentEl.classList.replace("grid", "hidden");
    toggleCollapseBookmarkButtonEl.children[0].className = "text-white ri-expand-horizontal-s-line";
  } else if (mode === "expand") {
    collapsibleContentEl.setAttribute("state", "expanded");
    collapsibleContentEl.classList.replace("hidden", "grid");
    toggleCollapseBookmarkButtonEl.children[0].className = "text-white ri-collapse-horizontal-line";
  }
};

// prettier-ignore
const toggleCollapseAllBookmarkNodesButtonEl = document.getElementById("bookmarks-user-defined-toggle-collapse-all-button") as HTMLButtonElement;
// prettier-ignore
toggleCollapseAllBookmarkNodesButtonEl.onclick = () => {
  const lastAction = toggleCollapseAllBookmarkNodesButtonEl.getAttribute("last-action");
  const bookmarkNodeEls = bookmarksUserDefinedList.querySelectorAll('[node-type="bookmark"], [node-type="folder"]');

  bookmarkNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid");

    const collapsibleContentEl = document.getElementById(`bookmark-${uuid}-collapsible-content`) as HTMLDivElement;
    const toggleCollapseBookmarkButtonEl = document.getElementById(`bookmark-${uuid}-toggle-collapse-button`) as HTMLButtonElement;

    if (lastAction === "expand") {
      toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "collapse");
      toggleCollapseAllBookmarkNodesButtonEl.setAttribute("last-action", "collapse");
      toggleCollapseAllBookmarkNodesButtonEl.innerHTML = `<span class="text-white text-base">expand all</span>`;
    } else if (lastAction === "collapse") {
      toggleCollapseBookmark(collapsibleContentEl, toggleCollapseBookmarkButtonEl, "expand");
      
      toggleCollapseAllBookmarkNodesButtonEl.setAttribute("last-action", "expand");
      toggleCollapseAllBookmarkNodesButtonEl.innerHTML = `<span class="text-white text-base">collapse all</span>`;
    }
  });
};

// prettier-ignore
const addBookmarkButtonEl = document.getElementById("bookmarks-user-defined-add-bookmark-button") as HTMLButtonElement;
// prettier-ignore
const addFolderButtonEl = document.getElementById("bookmarks-user-defined-add-folder-button") as HTMLButtonElement;

addBookmarkButtonEl.onclick = () => {
  addBookmarkNodeBookmark(
    {
      type: "bookmark",
      name: "New Bookmark",
      url: "about:blank",
      color: "#ffffff",
      iconType: "ri-box-3-line",
      iconColor: "#ffffff",
      fill: ""
    },
    bookmarksUserDefinedList
  );
};

addFolderButtonEl.onclick = () => {
  const randomColor = getRandomColor();

  addBookmarkNodeFolder(
    {
      type: "folder",
      name: "New Folder",
      color: randomColor,
      iconType: "",
      iconColor: randomColor,
      fill: "",
      contents: []
    },
    bookmarksUserDefinedList
  );
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

const resetBookmarkNodeEventListeners = () => {
  // prettier-ignore
  const bookmarkNodeEls = bookmarksUserDefinedList.querySelectorAll('[node-type="bookmark"], [node-type="folder"]');

  bookmarkNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;
    if (el.getAttribute("node-type") === "bookmark") {
      handleBookmarkSettings(uuid);
    } else if (el.getAttribute("node-type") === "folder") {
      handleFolderSettings(uuid);
    }
  });
};

export const fixBookmarkNodes = () => {
  handleBookmarkNodesDragging();
  bindToggleCollapseHandlers();
  resetBookmarkNodeEventListeners();
};

const addBookmarkNodeBookmark = (bookmark: BookmarkNodeBookmark, targetDivEl: HTMLDivElement) => {
  const uuid = genid();

  // targetDivEl.innerHTML += `
  //   <div class="bookmark-user-defined-item bg-neutral-800 grid grid-cols-[max-content_auto] rounded-md overflow-hidden" node-type="bookmark" bookmark-node-uuid="${uuid}">
  //     <div id="bookmark-${uuid}-user-defined-accent" class="w-1 h-full" style="background-color:${bookmark.color};"></div>
  //     <div class="p-2 grid grid-flow-row gap-4">
  //       <div class="grid grid-cols-[max-content_auto_max-content] place-items-center">
  //         <i class="text-white ri-bookmark-fill"></i>
  //         <span id="bookmark-${uuid}-user-defined-useless-title" class="text-white text-base my-auto mr-auto ml-2">${bookmark.name}</span>
  //         <div class="grid grid-cols-3 gap-2">
  //           <button id="bookmark-${uuid}-toggle-collapse-button" class="bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
  //             <i class="text-white ri-collapse-horizontal-line"></i>
  //           </button>
  //           <button class="bookmark-node-handle bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
  //             <i class="text-white ri-draggable"></i>
  //           </button>
  //           <button id="bookmark-${uuid}-delete-button" class="bg-rose-500 hover:bg-rose-600 transition w-10 aspect-square rounded-md cursor-pointer">
  //             <i class="text-white ri-delete-bin-6-line"></i>
  //           </button>
  //         </div>
  //       </div>
  //       <div id="bookmark-${uuid}-collapsible-content" state="expanded" class="grid grid-flow-row gap-4">
  //         <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">bookmark.name</p>
  //           <div id="bookmark-${uuid}-name-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-name-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input name..." value="${bookmark.name}">
  //           </div>
  //         </div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">bookmark.url</p>
  //           <div id="bookmark-${uuid}-url-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-url-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input url..." value="${bookmark.url}">
  //           </div>
  //         </div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">bookmark.color</p>
  //           <div id="bookmark-${uuid}-color-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-color-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input color..." value="${bookmark.color}">
  //           </div>
  //         </div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">bookmark.iconType</p>
  //           <div id="bookmark-${uuid}-icon-type-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-icon-type-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input icon-type..." value="${bookmark.iconType}">
  //           </div>
  //         </div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">bookmark.iconColor</p>
  //           <div id="bookmark-${uuid}-icon-color-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-icon-color-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input-icon color..." value="${bookmark.iconColor}">
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // `;

  // container div
  const containerDiv = document.createElement("div");
  containerDiv.className =
    "bookmark-user-defined-item bg-neutral-800 grid grid-cols-[max-content_auto] rounded-md overflow-hidden";
  containerDiv.setAttribute("node-type", "bookmark");
  containerDiv.setAttribute("bookmark-node-uuid", uuid);

  // accent div
  const accentDiv = document.createElement("div");
  accentDiv.id = `bookmark-${uuid}-user-defined-accent`;
  accentDiv.className = "w-1 h-full";
  accentDiv.style.backgroundColor = bookmark.color;

  // content container
  const contentDiv = document.createElement("div");
  contentDiv.className = "p-2 grid grid-flow-row gap-4";

  // header row
  const headerDiv = document.createElement("div");
  headerDiv.className = "grid grid-cols-[max-content_auto_max-content] place-items-center";

  const bookmarkIcon = document.createElement("i");
  bookmarkIcon.className = "text-white ri-bookmark-fill";

  const titleSpan = document.createElement("span");
  titleSpan.id = `bookmark-${uuid}-user-defined-useless-title`;
  titleSpan.className = "text-white text-base my-auto mr-auto ml-2";
  titleSpan.textContent = bookmark.name;

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "grid grid-cols-3 gap-2";

  const buttons = [
    {
      id: `bookmark-${uuid}-toggle-collapse-button`,
      icon: "ri-collapse-horizontal-line",
      class: "bg-neutral-500 hover:bg-neutral-600"
    },
    { class: "bookmark-node-handle bg-neutral-500 hover:bg-neutral-600", icon: "ri-draggable" },
    {
      id: `bookmark-${uuid}-delete-button`,
      icon: "ri-delete-bin-6-line",
      class: "bg-rose-500 hover:bg-rose-600"
    }
  ];

  buttons.forEach(({ id, icon, class: buttonClass }) => {
    const button = document.createElement("button");
    if (id) button.id = id;
    button.className = `${buttonClass} transition w-10 aspect-square rounded-md cursor-pointer`;
    const buttonIcon = document.createElement("i");
    buttonIcon.className = `text-white ${icon}`;
    button.appendChild(buttonIcon);
    buttonGroup.appendChild(button);
  });

  headerDiv.append(bookmarkIcon, titleSpan, buttonGroup);

  // collapsible content
  const collapsibleContent = document.createElement("div");
  collapsibleContent.id = `bookmark-${uuid}-collapsible-content`;
  collapsibleContent.setAttribute("state", "expanded");
  collapsibleContent.className = "grid grid-flow-row gap-4";

  const separator = document.createElement("div");
  separator.className = "bg-neutral-500 h-[1px] rounded-md my-auto";
  collapsibleContent.appendChild(separator);

  const fields = [
    { label: "bookmark.name", id: "name", value: bookmark.name },
    { label: "bookmark.url", id: "url", value: bookmark.url },
    { label: "bookmark.color", id: "color", value: bookmark.color },
    { label: "bookmark.iconType", id: "icon-type", value: bookmark.iconType },
    { label: "bookmark.iconColor", id: "icon-color", value: bookmark.iconColor },
    { label: "bookmark.fill", id: "fill", value: bookmark.fill }
  ];

  fields.forEach(({ label, id, value }) => {
    const fieldGroup = document.createElement("div");
    fieldGroup.className = "grid gap-2";

    const labelP = document.createElement("p");
    labelP.className = "text-white text-base";
    labelP.textContent = label;

    const inputContainer = document.createElement("div");
    inputContainer.id = `bookmark-${uuid}-${id}-container`;
    inputContainer.className =
      "grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent";

    const inputPrefix = document.createElement("span");
    inputPrefix.className = "text-pink-500 font-semibold select-none";
    inputPrefix.innerHTML = ">&nbsp;";

    const input = document.createElement("input");
    input.id = `bookmark-${uuid}-${id}-input`;
    input.type = "text";
    input.autocomplete = "off";
    input.className = "outline-none bg-transparent text-white placeholder-neutral-500";

    if (id === "fill") input.placeholder = `input fill... (leave empty for default)`;
    else input.placeholder = `input ${id}...`;

    input.value = value;

    inputContainer.append(inputPrefix, input);
    fieldGroup.append(labelP, inputContainer);
    collapsibleContent.appendChild(fieldGroup);
  });

  contentDiv.append(headerDiv, collapsibleContent);
  containerDiv.append(accentDiv, contentDiv);
  targetDivEl.appendChild(containerDiv);

  handleBookmarkSettings(uuid);
  fixBookmarkNodes();
};

const addBookmarkNodeFolder = (folder: BookmarkNodeFolder, targetDivEl: HTMLDivElement) => {
  const uuid = genid();

  // targetDivEl.innerHTML += `
  //   <div class="bookmark-user-defined-item bg-neutral-800 grid grid-cols-[max-content_auto] rounded-md overflow-hidden" node-type="folder" bookmark-node-uuid="${uuid}">
  //     <div id="bookmark-${uuid}-user-defined-accent" class="w-1 h-full" style="background-color:${folder.color};"></div>
  //     <div class="p-2 grid grid-flow-row gap-2">
  //       <div class="grid grid-cols-[max-content_auto_max-content] place-items-center">
  //         <i class="text-white ri-folder-fill"></i>
  //         <span id="bookmark-${uuid}-user-defined-useless-title" class="text-white text-base my-auto mr-auto ml-2">${folder.name}</span>
  //         <div class="grid grid-cols-3 gap-2">
  //           <button id="bookmark-${uuid}-toggle-collapse-button" class="bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
  //             <i class="text-white ri-collapse-horizontal-line"></i>
  //           </button>
  //           <button class="bookmark-node-handle bg-neutral-500 hover:bg-neutral-600 transition w-10 aspect-square rounded-md cursor-pointer">
  //             <i class="text-white ri-draggable"></i>
  //           </button>
  //           <button id="bookmark-${uuid}-delete-button" class="bg-rose-500 hover:bg-rose-600 transition w-10 aspect-square rounded-md cursor-pointer">
  //             <i class="text-white ri-delete-bin-6-line"></i>
  //           </button>
  //         </div>
  //       </div>
  //       <div id="bookmark-${uuid}-collapsible-content" state="expanded" class="grid grid-flow-row gap-4">
  //         <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">folder.name</p>
  //           <div id="bookmark-${uuid}-name-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-name-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input name..." value="${folder.name}">
  //           </div>
  //         </div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">folder.color</p>
  //           <div id="bookmark-${uuid}-color-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-color-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input color..." value="${folder.color}">
  //           </div>
  //         </div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">folder.color</p>
  //           <div id="bookmark-${uuid}-icon-type-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-icon-type-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input icon-type... (leave empty for default)" value="${folder.color}">
  //           </div>
  //         </div>
  //         <div class="grid gap-2">
  //           <p class="text-white text-base">folder.iconColor</p>
  //           <div id="bookmark-${uuid}-icon-color-container" class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
  //             <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
  //             <input id="bookmark-${uuid}-icon-color-input" type="text" autocomplete="off" class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input color..." value="${folder.iconColor}">
  //           </div>
  //         </div>
  //         <div>
  //           <p class="text-white text-base">folder.contents</p>
  //         </div>
  //       </div>
  //       <div id="bookmark-${uuid}-contents-container" class="bookmarks-user-defined-dropzone grid grid-flow-row gap-2 bg-neutral-900 rounded-md p-2 min-h-14"></div>
  //     </div>
  //   </div>
  // `;

  // container div
  const containerDiv = document.createElement("div");
  containerDiv.className =
    "bookmark-user-defined-item bg-neutral-800 grid grid-cols-[max-content_auto] rounded-md overflow-hidden";
  containerDiv.setAttribute("node-type", "folder");
  containerDiv.setAttribute("bookmark-node-uuid", uuid);

  // accent div
  const accentDiv = document.createElement("div");
  accentDiv.id = `bookmark-${uuid}-user-defined-accent`;
  accentDiv.className = "w-1 h-full";
  accentDiv.style.backgroundColor = folder.color;

  // content container
  const contentDiv = document.createElement("div");
  contentDiv.className = "p-2 grid grid-flow-row gap-2";

  // header row
  const headerDiv = document.createElement("div");
  headerDiv.className = "grid grid-cols-[max-content_auto_max-content] place-items-center";

  const folderIcon = document.createElement("i");
  folderIcon.className = "text-white ri-folder-fill";

  const titleSpan = document.createElement("span");
  titleSpan.id = `bookmark-${uuid}-user-defined-useless-title`;
  titleSpan.className = "text-white text-base my-auto mr-auto ml-2";
  titleSpan.textContent = folder.name;

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "grid grid-cols-3 gap-2";

  const buttons = [
    {
      id: `bookmark-${uuid}-toggle-collapse-button`,
      icon: "ri-collapse-horizontal-line",
      class: "bg-neutral-500 hover:bg-neutral-600"
    },
    { class: "bookmark-node-handle bg-neutral-500 hover:bg-neutral-600", icon: "ri-draggable" },
    {
      id: `bookmark-${uuid}-delete-button`,
      icon: "ri-delete-bin-6-line",
      class: "bg-rose-500 hover:bg-rose-600"
    }
  ];

  buttons.forEach(({ id, icon, class: buttonClass }) => {
    const button = document.createElement("button");
    if (id) button.id = id;
    button.className = `${buttonClass} transition w-10 aspect-square rounded-md cursor-pointer`;
    const buttonIcon = document.createElement("i");
    buttonIcon.className = `text-white ${icon}`;
    button.appendChild(buttonIcon);
    buttonGroup.appendChild(button);
  });

  headerDiv.append(folderIcon, titleSpan, buttonGroup);

  // collapsible content
  const collapsibleContent = document.createElement("div");
  collapsibleContent.id = `bookmark-${uuid}-collapsible-content`;
  collapsibleContent.setAttribute("state", "expanded");
  collapsibleContent.className = "grid grid-flow-row gap-4";

  const separator = document.createElement("div");
  separator.className = "bg-neutral-500 h-[1px] rounded-md my-auto";
  collapsibleContent.appendChild(separator);

  const fields = [
    { label: "folder.name", id: "name", value: folder.name },
    { label: "folder.color", id: "color", value: folder.color },
    { label: "folder.iconType", id: "icon-type", value: folder.iconType ?? "" },
    { label: "folder.iconColor", id: "icon-color", value: folder.iconColor },
    { label: "folder.fill", id: "fill", value: folder.fill }
  ];

  fields.forEach(({ label, id, value }) => {
    const fieldGroup = document.createElement("div");
    fieldGroup.className = "grid gap-2";

    const labelP = document.createElement("p");
    labelP.className = "text-white text-base";
    labelP.textContent = label;

    const inputContainer = document.createElement("div");
    inputContainer.id = `bookmark-${uuid}-${id}-container`;
    inputContainer.className =
      "grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent";

    const inputPrefix = document.createElement("span");
    inputPrefix.className = "text-pink-500 font-semibold select-none";
    inputPrefix.innerHTML = ">&nbsp;";

    const input = document.createElement("input");
    input.id = `bookmark-${uuid}-${id}-input`;
    input.type = "text";
    input.autocomplete = "off";
    input.className = "outline-none bg-transparent text-white placeholder-neutral-500";

    if (id === "fill") input.placeholder = `input fill... (leave empty for default)`;
    if (id === "icon-type") input.placeholder = `input icon-type... (leave empty for default)`;
    else input.placeholder = `input ${id}...`;

    input.value = value;

    inputContainer.append(inputPrefix, input);
    fieldGroup.append(labelP, inputContainer);
    collapsibleContent.appendChild(fieldGroup);
  });

  const contentsLabel = document.createElement("p");
  contentsLabel.className = "text-white text-base";
  contentsLabel.textContent = "folder.contents";
  collapsibleContent.appendChild(contentsLabel);

  const contentsContainer = document.createElement("div");
  contentsContainer.id = `bookmark-${uuid}-contents-container`;
  contentsContainer.className =
    "bookmarks-user-defined-dropzone grid grid-flow-row gap-2 bg-neutral-900 rounded-md p-2 min-h-14";
  contentDiv.append(headerDiv, collapsibleContent, contentsContainer);

  containerDiv.append(accentDiv, contentDiv);
  targetDivEl.appendChild(containerDiv);

  folder.contents.forEach((content) => {
    if (content.type === "bookmark") {
      addBookmarkNodeBookmark(content, contentsContainer as HTMLDivElement);
    } else if (content.type === "folder") {
      addBookmarkNodeFolder(content, contentsContainer as HTMLDivElement);
    }
  });

  handleFolderSettings(uuid);
  fixBookmarkNodes();
};
