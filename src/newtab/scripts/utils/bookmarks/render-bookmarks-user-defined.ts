import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  bindActionsToBlockBookmark,
  bindActionsToBlockFolder,
  createFolderArea,
  renderBlockBookmark,
  renderBlockFolder,
  renderBookmarkNodes
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils-new";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";
import { genid } from "src/utils/genid";

// animations handled separately
export const renderUserDefinedBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "grid-flow-row", "gap-2");

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

  const rootFolderUUID = genid();
  const rootFolderAreaEl = createFolderArea(rootFolderUUID);

  renderBookmarkNodes(config.bookmarks.userDefined, rootFolderAreaEl, config);
};
