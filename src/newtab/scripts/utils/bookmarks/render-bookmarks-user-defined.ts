import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  bindActionsToBlockBookmark,
  bindActionsToBlockFolder,
  renderBlockBookmark,
  renderBlockFolder
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

  const uiStyle = config.ui.style;
  const bookmarkTiming = config.animations.bookmarkTiming;
  const showBookmarkNames = config.bookmarks.showBookmarkNames;
  const messageTextColor = config.message.textColor;
  const animationsEnabled = config.animations.enabled;
  const animationsInitialType = config.animations.initialType;
  const bookmarkType = config.animations.bookmarkType;
  const focusedBorderColor = config.search.focusedBorderColor;

  config.bookmarks.userDefined.forEach((bookmarkNode, index) => {
    if (bookmarkNode.type === "bookmark") {
      const uuid = renderBlockBookmark(
        bookmarksContainerEl,
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
        focusedBorderColor
      );
    } else {
      const uuid = renderBlockFolder(
        bookmarksContainerEl,
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
        focusedBorderColor
      );
    }
  });
};
