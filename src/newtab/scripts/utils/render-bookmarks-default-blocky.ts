import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  focusBookmark,
  openBookmark,
  renderBlockBookmark,
  unfocusBookmark
} from "src/newtab/scripts/utils/bookmark-utils";

// animations handled separately
export const renderDefaultBlockyBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "gap-2", "default-blocky-bookmarks-cols");

  const defaultBlockyBookmarkCss = `
.default-blocky-bookmarks-cols {
  grid-template-columns: 1fr 1fr;
}

@media (min-width: 768px) {
  .default-blocky-bookmarks-cols {
    grid-template-columns: repeat(${config.bookmarks.defaultBlockyCols}, minmax(0, 1fr));
  }
}
`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(defaultBlockyBookmarkCss));
  document.head.appendChild(styleElement);

  chrome.bookmarks.search({}, (chromeBookmarks) => {
    console.log(chromeBookmarks);
    chromeBookmarks.forEach((bookmark, index) => {
      const isFolder = !bookmark.url;
      if (!isFolder) return;

      const folderId = bookmark.id;
      const folderChildren = chromeBookmarks.filter((bookmark) => bookmark.parentId === folderId);

      // prettier-ignore
      let iconHTML = `<img class="w-10 md:w-14" src="${`chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(bookmark.url as string)}&size=${64}`}" />`;

      console.log(bookmark.title, folderChildren);

      folderChildren.forEach((bookmark) => {
        renderBlockBookmark(
          config.animations.bookmarkTiming,
          config.bookmarks.userDefined.length,
          index,
          bookmark.title,
          config.bookmarks.defaultBlockyColor,
          null,
          null,
          iconHTML,
          config.ui.style,
          config.animations.enabled,
          config.animations.initialType
        );
      });
    });

    chromeBookmarks.forEach((bookmark, index) => {
      // prettier-ignore
      const bookmarkEl = document.getElementById(`bookmark-${bookmark.id}-${index}`) as HTMLDivElement;
      // prettier-ignore
      const bookmarkBorderEl = document.getElementById(`bookmark-${bookmark.id}-${index}-border`) as HTMLDivElement;

      bookmarkEl.addEventListener("blur", () => unfocusBookmark(bookmarkBorderEl));
      bookmarkEl.addEventListener("focus", (e) => focusBookmark(bookmarkBorderEl, config, e));
    });

    config.animations &&
      chromeBookmarks.forEach((bookmark, index) => {
        // prettier-ignore
        const bookmarkEl = document.getElementById(`bookmark-${bookmark.id}-${index}`) as HTMLButtonElement;

        if (bookmarkEl && config.animations) {
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
};
