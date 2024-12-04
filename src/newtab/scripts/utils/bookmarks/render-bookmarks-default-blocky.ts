import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  createFolderArea,
  renderBookmarkNodes
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils-new";
import { convertBrowserBookmarksToBookmarkNodes } from "src/newtab/scripts/utils/bookmarks/convert-browser-bookmarks";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";
import { genid } from "src/utils/genid";

// animations handled separately
export const renderDefaultBlockyBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "gap-2", "grid-flow-row");

  // const defaultBlockyBookmarkCss = `
  // .default-blocky-bookmarks-cols {
  //   grid-template-columns: 1fr 1fr;
  // }

  // @media (min-width: 768px) {
  //   .default-blocky-bookmarks-cols {
  //     grid-template-columns: repeat(${config.bookmarks.defaultBlockyCols}, minmax(0, 1fr));
  //   }
  // }`;

  insertCSS(
    `.bookmarks-cols{grid-template-columns:1fr 1fr;}@media (min-width: 768px){.bookmarks-cols{grid-template-columns:repeat(${config.bookmarks.defaultBlockyCols}, minmax(0, 1fr));}}`
  );

  const rootFolderUUID = genid();
  const rootFolderAreaEl = createFolderArea(rootFolderUUID, true);

  convertBrowserBookmarksToBookmarkNodes(
    config.bookmarks.bookmarksLocationFirefox,
    config.bookmarks.defaultBlockyColorType,
    config.bookmarks.defaultFaviconSource
  ).then((bookmarkNodes) => {
    renderBookmarkNodes(bookmarkNodes, rootFolderAreaEl, true, config);
  });
};
