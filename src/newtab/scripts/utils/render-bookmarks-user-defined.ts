import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl, bookmarkSearchInputEl, searchInputEl } from "src/newtab/scripts/ui";
import { bindActionsToBlockNode, openBookmark, renderBlockBookmark } from "src/newtab/scripts/utils/bookmark-utils";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

// animations handled separately
export const renderUserDefinedBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "gap-2", "user-defined-bookmarks-cols");

  // const userDefinedBookmarkCss = `
  // .user-defined-bookmarks-cols {
  //   grid-template-columns: 1fr 1fr;
  // }

  // @media (min-width: 768px) {
  //   .user-defined-bookmarks-cols {
  //     grid-template-columns: repeat(${config.bookmarks.userDefinedCols}, minmax(0, 1fr));
  //   }
  // }`;

  insertCSS(`.user-defined-bookmarks-cols{grid-template-columns:1fr 1fr;}@media (min-width: 768px){.user-defined-bookmarks-cols{grid-template-columns:repeat(${config.bookmarks.userDefinedCols}, minmax(0, 1fr));}}`);

  config.bookmarks.userDefined.forEach((bookmark, index) => {
    renderBlockBookmark(bookmarksContainerEl, config.animations.bookmarkTiming, config.bookmarks.userDefined.length, index, bookmark.name, bookmark.color, bookmark.iconColor, bookmark.iconType, "", config.ui.style, config.bookmarks.showBookmarkNames, bookmark.name, config.message.textColor, config.animations.enabled, config.animations.initialType);

    if (config.bookmarks.userDefinedKeys) {
      document.addEventListener("keypress", (e) => {
        const searchFocused = document.activeElement === searchInputEl;
        const bookmarkSearchFocused = document.activeElement === bookmarkSearchInputEl;

        if (!searchFocused && !bookmarkSearchFocused) {
          if (e.key === (index + 1).toString()) {
            openBookmark(bookmark.url, config.animations.enabled, config.animations.bookmarkType);
          }
        }
      });
    }
  });

  config.animations &&
    config.bookmarks.userDefined.forEach((bookmark, index) => {
      bindActionsToBlockNode(
        // @ts-expect-error
        bookmark,
        index,
        [],
        config
      );
    });
};
