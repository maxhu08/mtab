import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  bindActionsToBlockNode,
  renderBlockBookmark
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils-new";
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

  insertCSS(
    `.user-defined-bookmarks-cols{grid-template-columns:1fr 1fr;}@media (min-width: 768px){.user-defined-bookmarks-cols{grid-template-columns:repeat(${config.bookmarks.userDefinedCols}, minmax(0, 1fr));}}`
  );

  config.bookmarks.userDefined.forEach((bookmark, index) => {
    const bookmarkColor = bookmark.type === "folder" ? "#ffffff" : bookmark.iconColor;
    const bookmarkIconType = bookmark.type === "folder" ? "ri-folder-fill" : bookmark.iconType;

    const uuid = renderBlockBookmark(
      bookmarksContainerEl,
      config.animations.bookmarkTiming,
      config.bookmarks.userDefined.length,
      index,
      bookmark.name,
      bookmark.color,
      bookmarkColor,
      bookmarkIconType,
      "",
      config.ui.style,
      config.bookmarks.showBookmarkNames,
      bookmark.name,
      config.message.textColor,
      config.animations.enabled,
      config.animations.initialType
    );

    bindActionsToBlockNode(
      uuid,
      config.animations.enabled,
      config.animations.initialType,
      config.search.focusedBorderColor
    );
  });
};
