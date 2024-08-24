import {
  AnimationBookmarkType,
  AnimationInitialType,
  BookmarkTiming,
  Config,
  UIStyle
} from "src/newtab/scripts/config";
import { bookmarksContainerEl, bookmarkSearchInputEl, contentEl } from "src/newtab/scripts/ui";

export const focusBookmark = (
  bookmarkBorderEl: HTMLDivElement,
  focusedBorderColor: string,
  e: Event
) => {
  bookmarkBorderEl.classList.remove("border-transparent");
  bookmarkBorderEl.style.borderColor = focusedBorderColor;

  bookmarkBorderEl.focus();
  e.preventDefault();
};

export const unfocusBookmark = (bookmarkBorderEl: HTMLDivElement) => {
  bookmarkBorderEl.blur();

  bookmarkBorderEl.style.borderColor = "#00000000";
  bookmarkBorderEl.classList.add("border-transparent");
};

export const openBookmark = (
  bookmarkUrl: string,
  animationsEnabled: boolean,
  animationsType: AnimationBookmarkType,
  openInNewTab: boolean = false
) => {
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

export const renderBlockBookmark = (
  bookmarkTiming: BookmarkTiming,
  bookmarksLength: number,
  bookmarkIndex: number,
  bookmarkName: string,
  bookmarkColor: string,
  bookmarkIconColor: string | null,
  bookmarkIconType: string | null,
  bookmarkIconHTML: string,
  uiStyle: UIStyle,
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

  // prettier-ignore
  bookmarksContainerEl.innerHTML += `
    <button id="bookmark-${bookmarkName}-${bookmarkIndex}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${
    uiStyle === "glass" ? "glass-effect" : ""
  } rounded-md h-bookmark overflow-hidden ${
    animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""
  }" ${animationsEnabled ? `style="animation-delay: ${delay}ms;"` : ""}>
      <div id="bookmark-${bookmarkName}-${bookmarkIndex}-border" class="absolute w-full h-full border-2 border-transparent rounded-md"></div>
      <div class="h-1" style="background-color: ${bookmarkColor}"></div>
      <div class="absolute w-full h-full hover:bg-white/20"></div>
      <div class="p-1 md:p-2 grid place-items-center h-full">
        <div class="bookmark-icon${iconSizeClass && " " + iconSizeClass}"${bookmarkIconColor && ` style="color: ${bookmarkIconColor};"`}>
          ${iconHTML}
        </div>
      </div>
    </button>
    `;
};

export const bindActionsToBlockBookmark = (
  bookmarkId: string,
  bookmarkIndex: number,
  bookmarkUrl: string,
  bookmarkFocusedBorderColor: string,
  isFolder: boolean,
  folderItems: chrome.bookmarks.BookmarkTreeNode[],
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  animationsBookmarkType: AnimationBookmarkType,
  config: Config
) => {
  // prettier-ignore
  const bookmarkEl = document.getElementById(`bookmark-${bookmarkId}-${bookmarkIndex}`) as HTMLButtonElement;
  // prettier-ignore
  const bookmarkBorderEl = document.getElementById(`bookmark-${bookmarkId}-${bookmarkIndex}-border`) as HTMLDivElement;

  if (bookmarkEl && animationsEnabled) {
    const computedStyle = window.getComputedStyle(bookmarkEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    bookmarkEl.addEventListener(
      "animationstart",
      () => {
        // Fix weird flickering issue on firefox
        setTimeout(() => {
          bookmarkEl.classList.remove("opacity-0");
          // fix bookmarks animations replaying after bookmark search esc
          bookmarkEl.classList.remove(animationsInitialType);
        }, animationDuration * 0.75); // needs to be less than 1
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

  if (isFolder) {
    bookmarkEl.onclick = () => {
      console.log("IS FOLDER");
      bookmarksContainerEl.innerHTML = "";
      console.log(folderItems);
      renderDefaultBlockyBookmarksNodes(folderItems, config);
    };
  } else {
    bookmarkEl.onclick = (e) => {
      if (e.ctrlKey) {
        openBookmark(bookmarkUrl, animationsEnabled, animationsBookmarkType, true);
      } else {
        openBookmark(bookmarkUrl!, animationsEnabled, animationsBookmarkType);
      }
    };
  }

  bookmarkEl.addEventListener("blur", () => unfocusBookmark(bookmarkBorderEl));
  bookmarkEl.addEventListener("focus", (e) =>
    focusBookmark(bookmarkBorderEl, bookmarkFocusedBorderColor, e)
  );
};

export const renderBlockBookmarkFolder = (
  bookmarkTiming: BookmarkTiming,
  bookmarksLength: number,
  bookmarkIndex: number,
  bookmarkName: string,
  bookmarkColor: string,
  bookmarkIconColor: string | null,
  bookmarkIconType: string | null,
  bookmarkIconHTML: string,
  uiStyle: UIStyle,
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

  // prettier-ignore
  bookmarksContainerEl.innerHTML += `
    <button id="bookmark-${bookmarkName}-${bookmarkIndex}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${
    uiStyle === "glass" ? "glass-effect" : ""
  } rounded-md h-bookmark overflow-hidden ${
    animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""
  }" ${animationsEnabled ? `style="animation-delay: ${delay}ms;"` : ""}>
      <div id="bookmark-${bookmarkName}-${bookmarkIndex}-border" class="absolute w-full h-full border-2 border-transparent rounded-md"></div>
      <div class="h-1" style="background-color: ${bookmarkColor}"></div>
      <div class="absolute w-full h-full hover:bg-white/20"></div>
      <div class="p-1 md:p-2 grid place-items-center h-full">
        <div class="bookmark-icon${iconSizeClass && " " + iconSizeClass}"${bookmarkIconColor && ` style="color: ${bookmarkIconColor};"`}>
          ${iconHTML}
        </div>
      </div>
    </button>
    `;
};

export const buildChromeBookmarksTree = (chromeBookmarks: chrome.bookmarks.BookmarkTreeNode[]) => {
  const bookmarksMap = new Map();
  const rootNodes: typeof chromeBookmarks = [];

  chromeBookmarks.forEach((item) => {
    item.children = [];
    bookmarksMap.set(item.id, item);
  });

  chromeBookmarks.forEach((item) => {
    if (item.parentId === "2") {
      rootNodes.push(item);
    } else {
      const parent = bookmarksMap.get(item.parentId);
      if (parent) {
        parent.children.push(item);
      }
    }
  });

  return rootNodes;
};

export const renderDefaultBlockyBookmarksNodes = (
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  config: Config
) => {
  nodes.forEach((node, index) => {
    // if has children item is a folder
    const isFolder = node.children!.length > 0;
    console.log(node, isFolder);

    if (isFolder) {
      const folder = node;

      renderBlockBookmarkFolder(
        config.animations.bookmarkTiming,
        nodes.length,
        index,
        folder.id,
        config.bookmarks.defaultBlockyColor,
        config.bookmarks.defaultBlockyColor,
        "ri-folder-fill",
        "",
        config.ui.style,
        config.animations.enabled,
        config.animations.initialType
      );
    } else {
      renderBlockBookmark(
        config.animations.bookmarkTiming,
        nodes.length,
        index,
        node.id,
        config.bookmarks.defaultBlockyColor,
        null,
        null,
        // prettier-ignore
        `<img class="w-10 md:w-14" src="${`chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(node.url as string)}&size=${64}`}" />`,
        config.ui.style,
        config.animations.enabled,
        config.animations.initialType
      );
    }
  });

  config.animations &&
    nodes.forEach((item, index) => {
      const isFolder = item.children!.length > 0;

      if (isFolder) {
        const folder = item;
        bindActionsToBlockBookmark(
          folder.id,
          index,
          folder.url!,
          config.search.focusedBorderColor,
          true,
          item.children!,
          config.animations.enabled,
          config.animations.initialType,
          config.animations.bookmarkType,
          config
        );
      } else {
        bindActionsToBlockBookmark(
          item.id,
          index,
          item.url!,
          config.search.focusedBorderColor,
          false,
          [],
          config.animations.enabled,
          config.animations.initialType,
          config.animations.bookmarkType,
          config
        );
      }
    });
};
