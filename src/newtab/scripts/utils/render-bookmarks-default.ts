import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks-utils";

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

  bookmarksContainerEl.innerHTML += `<div id="inner-bookmark-container"></div>`;
  // prettier-ignore
  const innerBookmarkContainer = document.getElementById("inner-bookmark-container") as HTMLDivElement;

  bookmarksContainerEl.classList.add(
    "p-2",
    "rounded-md",
    "overflow-hidden",
    "w-full",
    "overflow-scroll",
    "scrollbar-hidden",
    config.animations.enabled ? config.animations.initialType : "_ignore",
    config.animations.enabled ? "opacity-0" : "_ignore"
  );

  chrome.bookmarks.search({}, (chromeBookmarks) => {
    if (chromeBookmarks.length === 0) {
      innerBookmarkContainer.innerHTML += `
        <div class="overflow-hidden h-16 md:h-20 grid grid-rows-[auto_max-content] place-items-center">
          <span class="text-search text-base md:text-2xl font-message w-full text-center text-ellipsis overflow-hidden whitespace-nowrap"
                style="color: ${config.search.textColor}"
          >
            No bookmarks yet
          </span>
        </div>
      </a>
      `;
    }

    if (chromeBookmarks.length > 0) {
      innerBookmarkContainer.classList.add("grid", "grid-flow-col", "gap-2", "w-max");
    }

    chromeBookmarks.forEach((bookmark) => {
      if (!!bookmark.dateGroupModified) return;

      innerBookmarkContainer.innerHTML += `
      <button id="bookmark-default-${
        bookmark.id
      }" class="overflow-hidden w-16 md:w-20 aspect-square grid grid-rows-[auto_max-content] place-items-center cursor-pointer">
        <img class="h-[80%]" src="${`chrome-extension://${
          chrome.runtime.id
        }/_favicon/?pageUrl=${encodeURIComponent(bookmark.url as string)}&size=${64}`}" />
        <span class="text-base w-full font-search text-center text-ellipsis overflow-hidden whitespace-nowrap"
              style="color: ${config.search.textColor}"
        >
          ${bookmark.title.toString()}
        </span>
      </button>
      `;
    });

    chromeBookmarks.forEach((bookmark) => {
      if (!!bookmark.dateGroupModified) return;

      // prettier-ignore
      const bookmarkEl = document.getElementById(`bookmark-default-${bookmark.id}`) as HTMLDivElement;
      console.log(bookmarkEl, bookmark);
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

  config.animations &&
    bookmarksContainerEl.addEventListener(
      "animationend",
      () => {
        bookmarksContainerEl.classList.remove("opacity-0");
      },
      {
        once: true
      }
    );
};
