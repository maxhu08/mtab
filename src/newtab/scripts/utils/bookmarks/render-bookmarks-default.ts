import { Config } from "src/utils/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/open-bookmark";
import { getFaviconURL } from "src/newtab/scripts/utils/favicon-url";

export const renderDefaultBookmarks = (config: Config) => {
  switch (config.ui.style) {
    case "glass": {
      bookmarksContainerEl.classList.add("glass-effect");
      break;
    }
    case "solid": {
      bookmarksContainerEl.classList.add("bg-foreground");
      break;
    }
  }

  // <div id="inner-bookmark-container"></div>
  const innerBookmarkContainerEl = document.createElement("div");
  innerBookmarkContainerEl.id = "inner-bookmark-container";
  bookmarksContainerEl.appendChild(innerBookmarkContainerEl);
  const innerBookmarkContainer = innerBookmarkContainerEl;

  bookmarksContainerEl.classList.add(
    "p-2",
    "corner-style",
    "overflow-hidden",
    "w-full",
    "overflow-scroll",
    "scrollbar-hidden",
    config.animations.enabled ? config.animations.initialType : "_ignore",
    config.animations.enabled ? "opacity-0" : "_ignore"
  );

  chrome.bookmarks.search({}, (chromeBookmarks) => {
    const frag = document.createDocumentFragment();
    let hasRenderableBookmarks = false;

    for (const bookmark of chromeBookmarks) {
      if (bookmark.dateGroupModified || !bookmark.url) continue;
      hasRenderableBookmarks = true;

      const buttonEl = document.createElement("button");
      buttonEl.className =
        "overflow-hidden w-16 md:w-20 aspect-square grid grid-rows-[auto_max-content] place-items-center cursor-pointer";
      buttonEl.setAttribute("data-bookmark-url", bookmark.url);

      const imgEl = document.createElement("img");
      imgEl.className = "w-10 md:w-14";
      imgEl.src = getFaviconURL(bookmark.url, config.bookmarks.defaultFaviconSource);
      buttonEl.appendChild(imgEl);

      const spanEl = document.createElement("span");
      spanEl.className =
        "text-base w-full font-search text-center text-ellipsis overflow-hidden whitespace-nowrap";
      spanEl.style.color = config.search.textColor;
      spanEl.textContent = bookmark.title.toString();
      buttonEl.appendChild(spanEl);

      frag.appendChild(buttonEl);
    }

    if (!hasRenderableBookmarks) {
      // <div class="overflow-hidden h-16 md:h-20 grid grid-rows-[auto_max-content] place-items-center">
      //   <span class="text-search text-base md:text-2xl font-message w-full text-center text-ellipsis overflow-hidden whitespace-nowrap" style="color: ${config.search.textColor}">
      //     No bookmarks yet
      //   </span>
      // </div>
      const containerDivEl = document.createElement("div");
      containerDivEl.className =
        "overflow-hidden h-16 md:h-20 grid grid-rows-[auto_max-content] place-items-center";

      const textSpanEl = document.createElement("span");
      textSpanEl.className =
        "text-search text-base md:text-2xl font-message w-full text-center text-ellipsis overflow-hidden whitespace-nowrap";
      textSpanEl.style.color = config.search.textColor;
      textSpanEl.textContent = "No bookmarks yet";

      containerDivEl.appendChild(textSpanEl);
      frag.appendChild(containerDivEl);
    }

    if (hasRenderableBookmarks) {
      innerBookmarkContainer.classList.add("grid", "grid-flow-col", "gap-2", "w-max");
    }

    innerBookmarkContainer.appendChild(frag);

    innerBookmarkContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const buttonEl = target.closest("button[data-bookmark-url]") as HTMLButtonElement | null;
      if (!buttonEl) return;

      const url = buttonEl.getAttribute("data-bookmark-url");
      if (!url) return;

      openBookmark(
        url,
        config.animations.enabled,
        config.animations.bookmarkType,
        e.ctrlKey || e.metaKey
      );
    });

    innerBookmarkContainer.addEventListener("auxclick", (e) => {
      if (e.button !== 1) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const buttonEl = target.closest("button[data-bookmark-url]") as HTMLButtonElement | null;
      if (!buttonEl) return;

      const url = buttonEl.getAttribute("data-bookmark-url");
      if (!url) return;

      openBookmark(url, config.animations.enabled, config.animations.bookmarkType, true);
    });
  });

  if (config.animations) {
    const computedStyle = window.getComputedStyle(bookmarksContainerEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    bookmarksContainerEl.addEventListener(
      "animationstart",
      () => {
        setTimeout(() => {
          bookmarksContainerEl.classList.remove("opacity-0");
          bookmarksContainerEl.classList.remove(config.animations.initialType);
        }, animationDuration * 0.8); // needs to be less than 1
      },
      {
        once: true
      }
    );
  }
};
