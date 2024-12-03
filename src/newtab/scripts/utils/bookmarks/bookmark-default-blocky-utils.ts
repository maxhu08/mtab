import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  bindActionsToBackButton,
  bindActionsToBlockNode,
  renderBlockBookmark
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils";
import { getFaviconURL } from "src/newtab/scripts/utils/favicon-url";

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
    backButtonEl.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${
      config.ui.style === "glass" ? "glass-effect" : ""
    } corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden ${
      config.animations.enabled ? `${config.animations.initialType} opacity-0 outline-none` : ""
    }`;
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
    const randomColors = [
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
