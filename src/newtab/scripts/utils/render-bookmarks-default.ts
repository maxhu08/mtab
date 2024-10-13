import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import { openBookmark } from "src/newtab/scripts/utils/bookmark-utils";
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

  // prettier-ignore
  const innerBookmarkContainer = document.getElementById("inner-bookmark-container") as HTMLDivElement;

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
    if (chromeBookmarks.length === 0) {
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
      innerBookmarkContainer.appendChild(containerDivEl);
    }

    if (chromeBookmarks.length > 0) {
      innerBookmarkContainer.classList.add("grid", "grid-flow-col", "gap-2", "w-max");
    }

    chromeBookmarks.forEach((bookmark) => {
      if (!!bookmark.dateGroupModified) return;

      // <button id="bookmark-default-${bookmark.id}" class="overflow-hidden w-16 md:w-20 aspect-square grid grid-rows-[auto_max-content] place-items-center cursor-pointer">
      //   <img class="w-10 md:w-14" src="${getFaviconURL(bookmark.url!, userAgent)}" />
      //   <span class="text-base w-full font-search text-center text-ellipsis overflow-hidden whitespace-nowrap" style="color: ${config.search.textColor}">
      //     ${bookmark.title.toString()}
      //   </span>
      // </button>
      const buttonEl = document.createElement("button");
      buttonEl.id = `bookmark-default-${bookmark.id}`;
      buttonEl.className =
        "overflow-hidden w-16 md:w-20 aspect-square grid grid-rows-[auto_max-content] place-items-center cursor-pointer";

      const imgEl = document.createElement("img");
      imgEl.className = "w-10 md:w-14";
      imgEl.src = getFaviconURL(bookmark.url!, "google");
      buttonEl.appendChild(imgEl);

      const spanEl = document.createElement("span");
      spanEl.className =
        "text-base w-full font-search text-center text-ellipsis overflow-hidden whitespace-nowrap";
      spanEl.style.color = config.search.textColor;
      spanEl.textContent = bookmark.title.toString();
      buttonEl.appendChild(spanEl);

      innerBookmarkContainer.appendChild(buttonEl);
    });

    chromeBookmarks.forEach((bookmark) => {
      if (!!bookmark.dateGroupModified) return;

      // prettier-ignore
      const bookmarkEl = document.getElementById(`bookmark-default-${bookmark.id}`) as HTMLDivElement;
      bookmarkEl.onclick = (e) => {
        if (e.ctrlKey) {
          openBookmark(
            bookmark.url!,
            config.animations.enabled,
            config.animations.bookmarkType,
            true
          );
        } else {
          openBookmark(bookmark.url!, config.animations.enabled, config.animations.bookmarkType);
        }
      };
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
