import {
  AnimationBookmarkType,
  AnimationInitialType,
  BookmarkTiming,
  Config,
  UIStyle,
  UserDefinedBookmarkNode
} from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/open-bookmark";
import { openFolder } from "src/newtab/scripts/utils/bookmarks/open-folder";
import { focusElementBorder, unfocusElementBorder } from "src/newtab/scripts/utils/focus-utils";
import { genid } from "src/utils/genid";

export const renderBookmarkNodes = (
  bookmarkNodes: UserDefinedBookmarkNode[],
  folderAreaEl: HTMLDivElement,
  config: Config
) => {
  const uiStyle = config.ui.style;

  const bookmarkTiming = config.animations.bookmarkTiming;
  const showBookmarkNames = config.bookmarks.showBookmarkNames;
  const messageTextColor = config.message.textColor;
  const animationsEnabled = config.animations.enabled;
  const animationsInitialType = config.animations.initialType;
  const animationsBookmarkType = config.animations.bookmarkType;
  const bookmarkType = config.animations.bookmarkType;
  const searchFocusedBorderColor = config.search.focusedBorderColor;

  bookmarkNodes.forEach((bookmarkNode, index) => {
    if (bookmarkNode.type === "bookmark") {
      const uuid = renderBlockBookmark(
        folderAreaEl.children[0] as HTMLDivElement,
        bookmarkTiming,
        config.bookmarks.userDefined.length,
        index,
        bookmarkNode.name,
        bookmarkNode.color,
        bookmarkNode.iconColor,
        bookmarkNode.iconType,
        "",
        uiStyle,
        showBookmarkNames,
        messageTextColor,
        animationsEnabled,
        animationsInitialType
      );

      bindActionsToBlockBookmark(
        uuid,
        bookmarkNode.url,
        animationsEnabled,
        animationsInitialType,
        bookmarkType,
        searchFocusedBorderColor
      );
    } else {
      const uuid = renderBlockFolder(
        folderAreaEl.children[0] as HTMLDivElement,
        bookmarkTiming,
        config.bookmarks.userDefined.length,
        index,
        bookmarkNode.name,
        bookmarkNode.color,
        bookmarkNode.iconColor,
        uiStyle,
        showBookmarkNames,
        messageTextColor,
        animationsEnabled,
        animationsInitialType
      );

      bindActionsToBlockFolder(
        uuid,
        animationsEnabled,
        animationsInitialType,
        bookmarkType,
        searchFocusedBorderColor
      );

      if (bookmarkNode.contents.length > 0) {
        const newFolderAreaEl = createFolderArea(uuid);

        renderBookmarkNodes(bookmarkNode.contents, newFolderAreaEl, config);

        addFolderBackButton(
          newFolderAreaEl.children[1] as HTMLDivElement,
          uuid,
          uiStyle,
          animationsEnabled,
          animationsInitialType,
          0,
          messageTextColor
        );

        bindActionsToBackButton(
          newFolderAreaEl,
          folderAreaEl,
          uuid,
          animationsEnabled,
          animationsInitialType,
          animationsBookmarkType,
          searchFocusedBorderColor
        );
      }
    }
  });
};

export const createFolderArea = (uuid: string, state: boolean = false) => {
  // <div id="folder-${uuid}" folder-state="{state ? "open" : "closed"}" class="w-full ${state ? "grid" : "hidden"} grid-flow-row gap-2">
  //   <div id="folder-${uuid}-items" class="grid gap-2 user-defined-bookmarks-cols"></div>
  //   <div id="folder-${uuid}-actions"></div>
  // </div>

  const folderDiv = document.createElement("div");
  folderDiv.id = `folder-${uuid}`;
  folderDiv.setAttribute("folder-state", state ? "open" : "closed");
  folderDiv.className = `w-full ${state ? "grid" : "hidden"} grid-flow-row gap-2`;

  const itemsDiv = document.createElement("div");
  itemsDiv.id = `folder-${uuid}-items`;
  itemsDiv.className = "grid gap-2 user-defined-bookmarks-cols";

  const actionsDiv = document.createElement("div");
  actionsDiv.id = `folder-${uuid}-actions`;

  folderDiv.appendChild(itemsDiv);
  folderDiv.appendChild(actionsDiv);

  bookmarksContainerEl.appendChild(folderDiv);

  return folderDiv as HTMLDivElement;
};

export const renderBlockBookmark = (
  containerEl: HTMLDivElement,
  bookmarkTiming: BookmarkTiming,
  bookmarksLength: number,
  bookmarkIndex: number,
  bookmarkName: string,
  bookmarkColor: string,
  bookmarkIconColor: string,
  bookmarkIconType: string,
  bookmarkIconHTML: string,
  uiStyle: UIStyle,
  showName: boolean,
  nameTextColor: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType
) => {
  let delay = 0;

  if (bookmarkTiming === "uniform") delay = 150;
  else if (bookmarkTiming === "left") delay = (bookmarkIndex + 2) * 50;
  else if (bookmarkTiming === "right") delay = (bookmarksLength + 2 - bookmarkIndex) * 50;

  let iconHTML = bookmarkIconHTML;
  let iconSizeClass = "";

  if (bookmarkIconType) {
    if (bookmarkIconType.startsWith("ri-")) {
      iconHTML = `<i class="${bookmarkIconType}"></i>`;
      iconSizeClass = "text-4xl md:text-6xl";
    } else if (bookmarkIconType.startsWith("nf-")) {
      iconHTML = `<i class="nf ${bookmarkIconType}"></i>`;
      iconSizeClass = "text-5xl md:text-7xl";
    } else if (bookmarkIconType.startsWith("url-")) {
      const src = bookmarkIconType.split("url-")[1];
      iconHTML = `<img class="w-10 md:w-14" src="${src}" />`;
    }
  }

  const uuid = genid();

  // <button id="bookmark-${uuid}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}" ${animationsEnabled ? `style="animation-delay: ${delay}ms;"` : ""}>
  //   <div id="bookmark-${uuid}-border" class="absolute w-full h-full border-2 border-transparent corner-style"></div>
  //   <div class="h-1" style="background-color: ${bookmarkColor}"></div>
  //   <div class="absolute w-full h-full hover:bg-white/20"></div>
  //   <div class="p-1 md:p-2 grid place-items-center h-full">
  //     <div class="bookmark-node-icon${iconSizeClass && " " + iconSizeClass}"${bookmarkIconColor ? ` style="color: ${bookmarkIconColor};"` : ""}>
  //       ${iconHTML}
  //     </div>
  //     ${showName ? `<span class="visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap" style="color: ${nameTextColor}">${bookmarkVanityName}</span>` : ""}
  //   </div>
  // </button>

  const button = document.createElement("button");
  button.id = `bookmark-node-${uuid}`;
  button.setAttribute("node-type", "bookmark");
  button.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}`;
  if (animationsEnabled) button.style.animationDelay = `${delay}ms`;

  const borderDiv = document.createElement("div");
  borderDiv.id = `bookmark-node-${uuid}-border`;
  borderDiv.className = "absolute w-full h-full border-2 border-transparent corner-style";

  const colorBar = document.createElement("div");
  colorBar.className = "h-1";
  colorBar.style.backgroundColor = bookmarkColor;

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute w-full h-full hover:bg-white/20";

  const gridDiv = document.createElement("div");
  gridDiv.className = "p-1 md:p-2 grid place-items-center h-full";

  const iconDiv = document.createElement("div");
  iconDiv.className = `bookmark-node-icon${iconSizeClass ? " " + iconSizeClass : ""}`;
  iconDiv.style.color = bookmarkIconColor;
  iconDiv.innerHTML = iconHTML;

  let nameSpan: HTMLSpanElement | null = null;
  if (showName) {
    nameSpan = document.createElement("span");
    nameSpan.className =
      "visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap";
    nameSpan.style.color = nameTextColor;
    nameSpan.textContent = bookmarkName;
  }

  button.appendChild(borderDiv);
  button.appendChild(colorBar);
  button.appendChild(hoverDiv);
  gridDiv.appendChild(iconDiv);
  if (nameSpan) gridDiv.appendChild(nameSpan);
  button.appendChild(gridDiv);

  containerEl.appendChild(button);

  return uuid;
};

export const bindActionsToBlockBookmark = (
  uuid: string,
  url: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  animationsBookmarkType: AnimationBookmarkType,
  searchfocusedBorderColor: string
) => {
  // prettier-ignore
  const bookmarkEl = document.getElementById(`bookmark-node-${uuid}`) as HTMLButtonElement;
  // prettier-ignore
  const bookmarkBorderEl = document.getElementById(`bookmark-node-${uuid}-border`) as HTMLDivElement;

  if (bookmarkEl && animationsEnabled) {
    const computedStyle = window.getComputedStyle(bookmarkEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    bookmarkEl.addEventListener(
      "animationstart",
      () => {
        // fix weird flickering issue on firefox
        setTimeout(() => {
          bookmarkEl.classList.remove("opacity-0");
          // fix bookmarks animations replaying after bookmark search esc
          bookmarkEl.classList.remove(animationsInitialType);
        }, animationDuration * 0.8); // needs to be less than 1
      },
      {
        once: true
      }
    );

    // fix bookmarks disappearing if user leaves tab too quickly
    document.addEventListener("visibilitychange", () => {
      bookmarkEl.classList.remove("opacity-0");
    });
  }

  // can't be onclick in order to register middle click and can't be onmousedown because open in new tab fails
  bookmarkEl.onmouseup = (e) => {
    // open in new tab when holding ctrl or middle click
    if (e.ctrlKey || e.button === 1) {
      openBookmark(url, animationsEnabled, animationsBookmarkType, true);
    } else if (e.button === 0) {
      openBookmark(url, animationsEnabled, animationsBookmarkType);
    }
  };

  bookmarkEl.addEventListener("blur", () => unfocusElementBorder(bookmarkBorderEl));
  bookmarkEl.addEventListener("focus", (e) =>
    focusElementBorder(bookmarkBorderEl, searchfocusedBorderColor, e)
  );
};

export const renderBlockFolder = (
  containerEl: HTMLDivElement,
  bookmarkTiming: BookmarkTiming,
  nodesLength: number,
  nodeIndex: number,
  folderName: string,
  folderColor: string,
  folderIconColor: string,
  uiStyle: UIStyle,
  showName: boolean,
  nameTextColor: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType
) => {
  let delay = 0;

  if (bookmarkTiming === "uniform") delay = 150;
  else if (bookmarkTiming === "left") delay = (nodeIndex + 2) * 50;
  else if (bookmarkTiming === "right") delay = (nodesLength + 2 - nodeIndex) * 50;

  const iconHTML = `<i class="ri-folder-fill"></i>`;
  const iconSizeClass = "text-4xl md:text-6xl";

  const uuid = genid();

  const button = document.createElement("button");
  button.id = `bookmark-node-${uuid}`;
  button.setAttribute("node-type", "folder");
  button.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}`;
  if (animationsEnabled) button.style.animationDelay = `${delay}ms`;

  const borderDiv = document.createElement("div");
  borderDiv.id = `bookmark-node-${uuid}-border`;
  borderDiv.className = "absolute w-full h-full border-2 border-transparent corner-style";

  const colorBar = document.createElement("div");
  colorBar.className = "h-1";
  colorBar.style.backgroundColor = folderColor;

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute w-full h-full hover:bg-white/20";

  const gridDiv = document.createElement("div");
  gridDiv.className = "p-1 md:p-2 grid place-items-center h-full";

  const iconDiv = document.createElement("div");
  iconDiv.className = `bookmark-icon ${iconSizeClass}`;
  iconDiv.style.color = folderIconColor;
  iconDiv.innerHTML = iconHTML;

  let nameSpan: HTMLSpanElement | null = null;
  if (showName) {
    nameSpan = document.createElement("span");
    nameSpan.className =
      "visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap";
    nameSpan.style.color = nameTextColor;
    nameSpan.textContent = folderName;
  }

  button.appendChild(borderDiv);
  button.appendChild(colorBar);
  button.appendChild(hoverDiv);
  gridDiv.appendChild(iconDiv);
  if (nameSpan) gridDiv.appendChild(nameSpan);
  button.appendChild(gridDiv);

  containerEl.appendChild(button);

  return uuid;
};

export const bindActionsToBlockFolder = (
  uuid: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  animationsBookmarkType: AnimationBookmarkType,
  searchFocusedBorderColor: string
) => {
  // prettier-ignore
  const bookmarkEl = document.getElementById(`bookmark-node-${uuid}`) as HTMLButtonElement;
  // prettier-ignore
  const bookmarkBorderEl = document.getElementById(`bookmark-node-${uuid}-border`) as HTMLDivElement;

  if (bookmarkEl && animationsEnabled) {
    const computedStyle = window.getComputedStyle(bookmarkEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    bookmarkEl.addEventListener(
      "animationstart",
      () => {
        // fix weird flickering issue on firefox
        setTimeout(() => {
          bookmarkEl.classList.remove("opacity-0");
          // fix bookmarks animations replaying after bookmark search esc
          bookmarkEl.classList.remove(animationsInitialType);
        }, animationDuration * 0.8); // needs to be less than 1
      },
      {
        once: true
      }
    );

    // fix bookmarks disappearing if user leaves tab too quickly
    document.addEventListener("visibilitychange", () => {
      bookmarkEl.classList.remove("opacity-0");
    });
  }

  // todo: add onclick stuff
  // can't be onclick in order to register middle click and can't be onmousedown because open in new tab fails
  bookmarkEl.onmouseup = (e) => {
    // open folder when holding ctrl or middle click
    if (e.button === 0 || e.button === 1) {
      // prettier-ignore
      const currFolderAreaEl = bookmarksContainerEl.querySelector('[folder-state="open"]') as HTMLDivElement;
      const openFolderAreaEl = document.getElementById(`folder-${uuid}`) as HTMLDivElement;

      openFolder(
        currFolderAreaEl,
        openFolderAreaEl,
        animationsEnabled,
        animationsInitialType,
        animationsBookmarkType
      );
    }
  };

  bookmarkEl.addEventListener("blur", () => unfocusElementBorder(bookmarkBorderEl));
  bookmarkEl.addEventListener("focus", (e) =>
    focusElementBorder(bookmarkBorderEl, searchFocusedBorderColor, e)
  );
};

export const addFolderBackButton = (
  folderActionsAreaEl: HTMLDivElement,
  uuid: string,
  uiStyle: UIStyle,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  delay: number,
  messageTextColor: string
) => {
  // <button id="bookmark-folder-${uuid}-back-button" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}" ${animationsEnabled ? `style="animation-delay: ${delay}ms;"` : ""}>
  //   <div id="bookmark-folder-${uuid}-border" class="absolute top-0 left-0 w-full h-9 md:h-12 border-2 border-transparent corner-style"></div>
  //   <div class="absolute top-0 left-0 w-full h-9 md:h-12 hover:bg-white/20"></div>
  //   <div class="grid grid-cols-[max-content_auto] gap-2 font-message text-base md:text-2xl w-full" style="color: ${messageTextColor};">
  //     <i class="ri-arrow-left-line"></i>
  //     <span>Back</span>
  //   </div>
  // </button>

  const backButton = document.createElement("button");
  backButton.id = `folder-back-button-${uuid}`;
  backButton.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}`;
  if (animationsEnabled) {
    backButton.style.animationDelay = `${delay}ms`;
  }

  const borderDiv = document.createElement("div");
  borderDiv.id = `folder-back-button-${uuid}-border`;
  borderDiv.className =
    "absolute top-0 left-0 w-full h-9 md:h-12 border-2 border-transparent corner-style";

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute top-0 left-0 w-full h-9 md:h-12 hover:bg-white/20";

  const gridDiv = document.createElement("div");
  gridDiv.className =
    "grid grid-cols-[max-content_auto] gap-2 font-message text-base md:text-2xl w-full";
  gridDiv.style.color = messageTextColor;

  const icon = document.createElement("i");
  icon.className = "ri-arrow-left-line";

  const span = document.createElement("span");
  span.textContent = "Back";

  gridDiv.appendChild(icon);
  gridDiv.appendChild(span);

  backButton.appendChild(borderDiv);
  backButton.appendChild(hoverDiv);
  backButton.appendChild(gridDiv);

  folderActionsAreaEl.appendChild(backButton);
};

export const bindActionsToBackButton = (
  currFolderAreaEl: HTMLDivElement,
  openFolderAreaEl: HTMLDivElement,
  uuid: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  animationsBookmarkType: AnimationBookmarkType,
  searchFocusedBorderColor: string
) => {
  // prettier-ignore
  const backButtonEl = document.getElementById(`folder-back-button-${uuid}`) as HTMLButtonElement;
  // prettier-ignore
  const backButtonBorderEl = document.getElementById(`folder-back-button-${uuid}-border`) as HTMLDivElement;

  if (backButtonEl && animationsEnabled) {
    const computedStyle = window.getComputedStyle(backButtonEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    backButtonEl.addEventListener(
      "animationstart",
      () => {
        setTimeout(() => {
          backButtonEl.classList.remove("opacity-0");
          backButtonEl.classList.remove(animationsInitialType);
        }, animationDuration * 0.8); // needs to be less than 1
      },
      {
        once: true
      }
    );

    document.addEventListener("visibilitychange", () => {
      backButtonEl.classList.remove("opacity-0");
    });
  }

  backButtonEl.onclick = () => {
    openFolder(
      currFolderAreaEl,
      openFolderAreaEl,
      animationsEnabled,
      animationsInitialType,
      animationsBookmarkType
    );
  };

  backButtonEl.addEventListener("blur", () => unfocusElementBorder(backButtonBorderEl));
  backButtonEl.addEventListener("focus", (e) =>
    focusElementBorder(backButtonBorderEl, searchFocusedBorderColor, e)
  );
};
