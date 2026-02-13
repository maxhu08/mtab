import { Config } from "src/utils/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  createFolderArea,
  initBookmarkRenderRuntime,
  renderBookmarkNodes
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils";
import { getBrowserBookmarkNodes } from "src/newtab/scripts/utils/bookmarks/bookmark-data-cache";
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
    `.bookmarks-cols{grid-template-columns:1fr 1fr;}@media (min-width: 768px){.bookmarks-cols{grid-template-columns:repeat(${config.bookmarks.defaultBlockyCols}, minmax(0, 1fr));}}`,
    "bookmarks-cols-style"
  );

  const rootFolderUUID = genid();
  const rootFolderAreaEl = createFolderArea(rootFolderUUID, true);
  const frag = document.createDocumentFragment();
  frag.appendChild(rootFolderAreaEl);
  bookmarksContainerEl.appendChild(frag);

  initBookmarkRenderRuntime(rootFolderAreaEl, config);

  getBrowserBookmarkNodes({
    bookmarksLocationFirefox: config.bookmarks.bookmarksLocationFirefox,
    defaultBlockyColorType: config.bookmarks.defaultBlockyColorType,
    defaultBlockyColor: config.bookmarks.defaultBlockyColor,
    defaultFaviconSource: config.bookmarks.defaultFaviconSource
  }).then((bookmarkNodes) => {
    renderBookmarkNodes(bookmarkNodes, rootFolderAreaEl, config.animations.enabled, config);
  });
};
