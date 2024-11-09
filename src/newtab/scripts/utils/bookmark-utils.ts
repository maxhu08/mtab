import {
  AnimationBookmarkType,
  AnimationInitialType,
  BookmarkTiming,
  Config,
  UIStyle,
  UserDefinedBookmark
} from "src/newtab/scripts/config";
import { bookmarksContainerEl, bookmarkSearchInputEl, contentEl } from "src/newtab/scripts/ui";
import { getFaviconURL } from "src/newtab/scripts/utils/favicon-url";
import { focusElementBorder, unfocusElementBorder } from "src/newtab/scripts/utils/focus-utils";

export const openBookmark = (
  bookmarkUrl: string,
  animationsEnabled: boolean,
  animationsType: AnimationBookmarkType,
  openInNewTab: boolean = false
) => {
  if (!/^https?:\/\//i.test(bookmarkUrl)) bookmarkUrl = `https://${bookmarkUrl}`;

  if (openInNewTab) {
    window.open(bookmarkUrl, "_blank");
    bookmarkSearchInputEl.value = "";

    return;
  }

  if (animationsEnabled) {
    contentEl.classList.add(animationsType);
    const computedStyle = getComputedStyle(contentEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;

    setTimeout(() => {
      contentEl.style.opacity = "0%";
    }, animationDuration - 10);

    setTimeout(() => {
      window.location.href = bookmarkUrl;
    }, animationDuration + 20);
  } else {
    window.location.href = bookmarkUrl;
  }
};

export const openBookmarkFolder = (
  chromeBookmarks: chrome.bookmarks.BookmarkTreeNode[],
  folderToLeaveId: string,
  newFolderId: string,
  config: Config,
  showBackButton: boolean
) => {
  // prettier-ignore
  const oldContainerEl = document.getElementById(`bookmark-folder-container-${folderToLeaveId}`) as HTMLDivElement;

  // prettier-ignore
  let newFolderChildren: chrome.bookmarks.BookmarkTreeNode[] = [];

  if (showBackButton) {
    newFolderChildren = chromeBookmarks.filter((bookmark) => bookmark.parentId === newFolderId);
  } else {
    const chromeBookmarksTree = buildChromeBookmarksTree(chromeBookmarks);
    newFolderChildren = chromeBookmarksTree;
  }

  if (config.animations.enabled) {
    oldContainerEl.classList.add(config.animations.bookmarkType);
    const computedStyle = getComputedStyle(oldContainerEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;

    setTimeout(() => {
      oldContainerEl.style.opacity = "0%";
    }, animationDuration - 10);

    setTimeout(() => {
      oldContainerEl.parentNode!.removeChild(oldContainerEl);
      renderDefaultBlockyBookmarksNodes(
        newFolderId,
        newFolderChildren,
        chromeBookmarks,
        config,
        showBackButton
      );
    }, animationDuration + 20);
  } else {
    oldContainerEl.parentNode!.removeChild(oldContainerEl);
    renderDefaultBlockyBookmarksNodes(
      newFolderId,
      newFolderChildren,
      chromeBookmarks,
      config,
      showBackButton
    );
  }
};

export const renderBlockBookmark = (
  containerEl: HTMLDivElement,
  bookmarkTiming: BookmarkTiming,
  bookmarksLength: number,
  bookmarkIndex: number,
  bookmarkName: string,
  bookmarkColor: string,
  bookmarkIconColor: string | null,
  bookmarkIconType: string | null,
  bookmarkIconHTML: string,
  uiStyle: UIStyle,
  showName: boolean,
  bookmarkVanityName: string,
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

  // <button id="bookmark-${bookmarkName}-${bookmarkIndex}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}" ${animationsEnabled ? `style="animation-delay: ${delay}ms;"` : ""}>
  //   <div id="bookmark-${bookmarkName}-${bookmarkIndex}-border" class="absolute w-full h-full border-2 border-transparent corner-style"></div>
  //   <div class="h-1" style="background-color: ${bookmarkColor}"></div>
  //   <div class="absolute w-full h-full hover:bg-white/20"></div>
  //   <div class="p-1 md:p-2 grid place-items-center h-full">
  //     <div class="bookmark-icon${iconSizeClass && " " + iconSizeClass}"${bookmarkIconColor ? ` style="color: ${bookmarkIconColor};"` : ""}>
  //       ${iconHTML}
  //     </div>
  //     ${showName ? `<span class="visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap" style="color: ${nameTextColor}">${bookmarkVanityName}</span>` : ""}
  //   </div>
  // </button>

  const buttonEl = document.createElement("button");
  buttonEl.id = `bookmark-${bookmarkName}-${bookmarkIndex}`;
  buttonEl.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}`;
  if (animationsEnabled) buttonEl.style.animationDelay = `${delay}ms`;

  const borderDiv = document.createElement("div");
  borderDiv.id = `bookmark-${bookmarkName}-${bookmarkIndex}-border`;
  borderDiv.className = "absolute w-full h-full border-2 border-transparent corner-style";
  buttonEl.appendChild(borderDiv);

  const colorDiv = document.createElement("div");
  colorDiv.className = "h-1";
  colorDiv.style.backgroundColor = bookmarkColor;
  buttonEl.appendChild(colorDiv);

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute w-full h-full hover:bg-white/20";
  buttonEl.appendChild(hoverDiv);

  const contentDiv = document.createElement("div");
  contentDiv.className = "p-1 md:p-2 grid place-items-center h-full";

  const iconDiv = document.createElement("div");
  iconDiv.className = `bookmark-icon${iconSizeClass ? " " + iconSizeClass : ""}`;
  if (bookmarkIconColor) iconDiv.style.color = bookmarkIconColor;
  iconDiv.innerHTML = iconHTML;
  contentDiv.appendChild(iconDiv);

  if (showName) {
    const nameSpan = document.createElement("span");
    nameSpan.className =
      "visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap";
    nameSpan.style.color = nameTextColor;
    nameSpan.textContent = bookmarkVanityName;
    contentDiv.appendChild(nameSpan);
  }

  buttonEl.appendChild(contentDiv);
  containerEl.appendChild(buttonEl);
};

export const bindActionsToBlockNode = (
  node: chrome.bookmarks.BookmarkTreeNode,
  index: number,
  chromeBookmarks: chrome.bookmarks.BookmarkTreeNode[],
  config: Config
) => {
  // if default-blocky or user-defined
  const identifier = node.id ? node.id : (node as unknown as UserDefinedBookmark).name;

  // prettier-ignore
  const bookmarkEl = document.getElementById(`bookmark-${identifier}-${index}`) as HTMLButtonElement;
  // prettier-ignore
  const bookmarkBorderEl = document.getElementById(`bookmark-${identifier}-${index}-border`) as HTMLDivElement;

  if (bookmarkEl && config.animations.enabled) {
    const computedStyle = window.getComputedStyle(bookmarkEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    bookmarkEl.addEventListener(
      "animationstart",
      () => {
        // Fix weird flickering issue on firefox
        setTimeout(() => {
          bookmarkEl.classList.remove("opacity-0");
          // fix bookmarks animations replaying after bookmark search esc
          bookmarkEl.classList.remove(config.animations.initialType);
        }, animationDuration * 0.8); // needs to be less than 1
      },
      {
        once: true
      }
    );

    // Fix bookmarks disappearing if user leaves tab too quickly
    document.addEventListener("visibilitychange", () => {
      bookmarkEl.classList.remove("opacity-0");
    });
  }

  const isFolder = node.children && node.children!.length > 0;

  if (isFolder) {
    bookmarkEl.onmouseup = () =>
      openBookmarkFolder(chromeBookmarks, node.parentId!, node.id, config, true);
  } else {
    // can't be onclick in order to register middle click and can't be onmousedown because open in new tab fails
    bookmarkEl.onmouseup = (e) => {
      // open in new tab when holding ctrl or middle click
      if (e.ctrlKey || e.button === 1) {
        openBookmark(node.url!, config.animations.enabled, config.animations.bookmarkType, true);
      } else if (e.button === 0) {
        openBookmark(node.url!, config.animations.enabled, config.animations.bookmarkType);
      }
    };
  }

  bookmarkEl.addEventListener("blur", () => unfocusElementBorder(bookmarkBorderEl));
  bookmarkEl.addEventListener("focus", (e) =>
    focusElementBorder(bookmarkBorderEl, config.search.focusedBorderColor, e)
  );
};

export const bindActionsToBackButton = (
  folderId: string,
  chromeBookmarks: chrome.bookmarks.BookmarkTreeNode[],
  config: Config
) => {
  // prettier-ignore
  const backButtonEl = document.getElementById(`bookmark-folder-${folderId}-back-button`) as HTMLButtonElement;
  // prettier-ignore
  const backButtonBorderEl = document.getElementById(`bookmark-folder-${folderId}-border`) as HTMLDivElement;

  if (backButtonEl && config.animations.enabled) {
    const computedStyle = window.getComputedStyle(backButtonEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    backButtonEl.addEventListener(
      "animationstart",
      () => {
        setTimeout(() => {
          backButtonEl.classList.remove("opacity-0");
          backButtonEl.classList.remove(config.animations.initialType);
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
    const folderNode = chromeBookmarks.find((bookmark) => bookmark.id === folderId)!;
    // prettier-ignore
    const parentFolderNode = chromeBookmarks.find((bookmark) => bookmark.id === folderNode.parentId)!;

    const isTopLevel = typeof folderNode === "undefined";
    const isParentTopLevel = typeof parentFolderNode === "undefined";
    if (isTopLevel) return;

    openBookmarkFolder(chromeBookmarks, folderId, folderNode.parentId!, config, !isParentTopLevel);
  };

  backButtonEl.addEventListener("blur", () => unfocusElementBorder(backButtonBorderEl));
  backButtonEl.addEventListener("focus", (e) =>
    focusElementBorder(backButtonBorderEl, config.search.focusedBorderColor, e)
  );
};

export const renderBlockBookmarkFolder = (
  containerEl: HTMLDivElement,
  bookmarkTiming: BookmarkTiming,
  bookmarksLength: number,
  bookmarkIndex: number,
  bookmarkName: string,
  bookmarkColor: string,
  bookmarkIconColor: string | null,
  bookmarkIconType: string | null,
  bookmarkIconHTML: string,
  uiStyle: UIStyle,
  showName: boolean,
  bookmarkVanityName: string,
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

  // <button id="bookmark-${bookmarkName}-${bookmarkIndex}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}" ${animationsEnabled ? `style="animation-delay: ${delay}ms;"` : ""}>
  //   <div id="bookmark-${bookmarkName}-${bookmarkIndex}-border" class="absolute w-full h-full border-2 border-transparent corner-style"></div>
  //   <div class="h-1" style="background-color: ${bookmarkColor}"></div>
  //   <div class="absolute w-full h-full hover:bg-white/20"></div>
  //   <div class="p-1 md:p-2 grid place-items-center h-full">
  //     <div class="bookmark-icon${iconSizeClass && " " + iconSizeClass}"${bookmarkIconColor && ` style="color: ${bookmarkIconColor};"`}>
  //       ${iconHTML}
  //     </div>
  //     ${showName ? `<span class="visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap" style="color: ${nameTextColor}">${bookmarkVanityName}</span>` : ""}
  //   </div>
  // </button>
  const buttonEl = document.createElement("button");
  buttonEl.id = `bookmark-${bookmarkName}-${bookmarkIndex}`;
  buttonEl.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}`;
  if (animationsEnabled) buttonEl.style.animationDelay = `${delay}ms`;

  const borderDiv = document.createElement("div");
  borderDiv.id = `bookmark-${bookmarkName}-${bookmarkIndex}-border`;
  borderDiv.className = "absolute w-full h-full border-2 border-transparent corner-style";
  buttonEl.appendChild(borderDiv);

  const colorDiv = document.createElement("div");
  colorDiv.className = "h-1";
  colorDiv.style.backgroundColor = bookmarkColor;
  buttonEl.appendChild(colorDiv);

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute w-full h-full hover:bg-white/20";
  buttonEl.appendChild(hoverDiv);

  const contentDiv = document.createElement("div");
  contentDiv.className = "p-1 md:p-2 grid place-items-center h-full";

  const iconDiv = document.createElement("div");
  iconDiv.className = `bookmark-icon${iconSizeClass ? " " + iconSizeClass : ""}`;
  if (bookmarkIconColor) iconDiv.style.color = bookmarkIconColor;
  iconDiv.innerHTML = iconHTML;
  contentDiv.appendChild(iconDiv);

  if (showName) {
    const nameSpan = document.createElement("span");
    nameSpan.className =
      "visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap";
    nameSpan.style.color = nameTextColor;
    nameSpan.textContent = bookmarkVanityName;
    contentDiv.appendChild(nameSpan);
  }

  buttonEl.appendChild(contentDiv);
  containerEl.appendChild(buttonEl);
};

export const buildChromeBookmarksTree = (chromeBookmarks: chrome.bookmarks.BookmarkTreeNode[]) => {
  const bookmarksMap = new Map<string, chrome.bookmarks.BookmarkTreeNode>();
  const rootNodes: chrome.bookmarks.BookmarkTreeNode[] = [];

  chromeBookmarks.forEach((item) => {
    item.children = [];
    bookmarksMap.set(item.id, item);
  });

  chromeBookmarks.forEach((item) => {
    if (!bookmarksMap.has(item.parentId!)) {
      rootNodes.push(item);
    } else {
      const parent = bookmarksMap.get(item.parentId!);
      if (parent) {
        parent.children!.push(item);
      }
    }
  });

  return rootNodes;
};

export const renderDefaultBlockyBookmarksNodes = (
  folderId: string,
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  chromeBookmarks: chrome.bookmarks.BookmarkTreeNode[],
  config: Config,
  showBackButton: boolean
) => {
  let delay = 0;
  if (config.animations.bookmarkTiming === "uniform") delay = 150;
  else delay = (nodes.length + 3) * 50;

  // <div id="bookmark-folder-container-${folderId}" class="w-full grid gap-2 grid-rows-[auto_max-content]"></div>
  const folderContainerEl = document.createElement("div");
  folderContainerEl.id = `bookmark-folder-container-${folderId}`;
  folderContainerEl.className = "w-full grid gap-2 grid-rows-[auto_max-content]";
  bookmarksContainerEl.appendChild(folderContainerEl);

  // <div id="bookmark-folder-nodes-container-${folderId}" class="w-full grid gap-2 default-blocky-bookmarks-cols"></div>
  const nodesContainerEl = document.createElement("div");
  nodesContainerEl.id = `bookmark-folder-nodes-container-${folderId}`;
  nodesContainerEl.className = "w-full grid gap-2 default-blocky-bookmarks-cols";
  folderContainerEl.appendChild(nodesContainerEl);

  // <div id="bookmark-folder-actions-container-${folderId}" class="w-full grid place-items-center"></div>
  const actionsContainerEl = document.createElement("div");
  actionsContainerEl.id = `bookmark-folder-actions-container-${folderId}`;
  actionsContainerEl.className = "w-full grid place-items-center";
  folderContainerEl.appendChild(actionsContainerEl);

  // Handle Firefox bookmark categories
  const isParentFirefoxBookmarkCategory =
    folderId === "menu________" || folderId === "toolbar_____" || folderId === "unfiled_____";
  if (isParentFirefoxBookmarkCategory) showBackButton = false;

  if (showBackButton) {
    // <button id="bookmark-folder-${folderId}-back-button" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${config.ui.style === "glass" ? "glass-effect" : ""} corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden ${config.animations.enabled ? `${config.animations.initialType} opacity-0 outline-none` : ""}" ${config.animations.enabled ? `style="animation-delay: ${delay}ms;"` : ""}>
    //   <div id="bookmark-folder-${folderId}-border" class="absolute top-0 left-0 w-full h-9 md:h-12 border-2 border-transparent corner-style"></div>
    //   <div class="absolute top-0 left-0 w-full h-9 md:h-12 hover:bg-white/20"></div>
    //   <div class="grid grid-cols-[max-content_auto] gap-2 font-message text-base md:text-2xl w-full" style="color: ${config.message.textColor};">
    //     <i class="ri-arrow-left-line"></i>
    //     <span>Back</span>
    //   </div>
    // </button>
    const backButtonEl = document.createElement("button");
    backButtonEl.id = `bookmark-folder-${folderId}-back-button`;
    backButtonEl.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${config.ui.style === "glass" ? "glass-effect" : ""} corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden ${config.animations.enabled ? `${config.animations.initialType} opacity-0 outline-none` : ""}`;
    if (config.animations.enabled) backButtonEl.style.animationDelay = `${delay}ms`;

    const borderDivEl = document.createElement("div");
    borderDivEl.id = `bookmark-folder-${folderId}-border`;
    borderDivEl.className =
      "absolute top-0 left-0 w-full h-9 md:h-12 border-2 border-transparent corner-style";
    backButtonEl.appendChild(borderDivEl);

    const hoverDivEl = document.createElement("div");
    hoverDivEl.className = "absolute top-0 left-0 w-full h-9 md:h-12 hover:bg-white/20";
    backButtonEl.appendChild(hoverDivEl);

    const gridDivEl = document.createElement("div");
    gridDivEl.className =
      "grid grid-cols-[max-content_auto] gap-2 font-message text-base md:text-2xl w-full";
    gridDivEl.style.color = config.message.textColor;

    const iconEl = document.createElement("i");
    iconEl.className = "ri-arrow-left-line";
    gridDivEl.appendChild(iconEl);

    const textSpanEl = document.createElement("span");
    textSpanEl.textContent = "Back";
    gridDivEl.appendChild(textSpanEl);

    backButtonEl.appendChild(gridDivEl);
    actionsContainerEl.appendChild(backButtonEl);
  } else {
    // <div class="relative corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden opacity-0 outline-none"></div>
    const emptyDivEl = document.createElement("div");
    emptyDivEl.className =
      "relative corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden opacity-0 outline-none";
    actionsContainerEl.appendChild(emptyDivEl);
  }

  nodes.forEach((node, index) => {
    // if has children item is a folder
    const isFolder = node.children!.length > 0;

    let color = config.bookmarks.defaultBlockyColor;
    let randomColors = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#eab308",
      "#84cc16",
      "#22c55e",
      "#10b981",
      "#14b8a6",
      "#06b6d4",
      "#0ea5e9",
      "#3b82f6",
      "#6366f1",
      "#8b5cf6",
      "#a855f7",
      "#d946ef",
      "#ec4899",
      "#f43f5e"
    ];

    // pick random color based on node.title
    if (config.bookmarks.defaultBlockyColorType === "random") {
      let hash = 0;
      for (let i = 0; i < node.title.length; i++) {
        hash = (hash << 5) - hash + node.title.charCodeAt(i);
      }

      hash += node.title.length * 31;

      color = randomColors[Math.abs(hash) % randomColors.length];
    }

    if (isFolder) {
      const folder = node;

      renderBlockBookmarkFolder(
        nodesContainerEl,
        config.animations.bookmarkTiming,
        nodes.length,
        index,
        folder.id,
        color,
        color,
        "ri-folder-fill",
        "",
        config.ui.style,
        config.bookmarks.showBookmarkNames,
        node.title,
        config.message.textColor,
        config.animations.enabled,
        config.animations.initialType
      );
    } else {
      renderBlockBookmark(
        nodesContainerEl,
        config.animations.bookmarkTiming,
        nodes.length,
        index,
        node.id,
        color,
        null,
        null,
        // prettier-ignore
        `<img class="w-10 md:w-14" src="${getFaviconURL(node.url!, config.bookmarks.defaultFaviconSource)}" />`,
        config.ui.style,
        config.bookmarks.showBookmarkNames,
        node.title,
        config.message.textColor,
        config.animations.enabled,
        config.animations.initialType
      );
    }
  });

  config.animations &&
    nodes.forEach((node, index) => {
      const isFolder = node.children!.length > 0;

      if (isFolder) {
        const folder = node;
        bindActionsToBlockNode(folder, index, chromeBookmarks, config);
      } else {
        bindActionsToBlockNode(node, index, chromeBookmarks, config);
      }
    });

  if (showBackButton) bindActionsToBackButton(nodes[0].parentId!, chromeBookmarks, config);
};
