import { Config } from "src/utils/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  createFolderArea,
  initBookmarkRenderRuntime,
  renderBookmarkNodes
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";
import { genid } from "src/utils/genid";

// animations handled separately
export const renderBookmarkNodeBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "grid-flow-row", "gap-2");

  // const BookmarkNodeBookmarkCss = `
  // .user-defined-bookmarks-cols {
  //   grid-template-columns: 1fr 1fr;
  // }

  // @media (min-width: 768px) {
  //   .user-defined-bookmarks-cols {
  //     grid-template-columns: repeat(${config.bookmarks.userDefinedCols}, minmax(0, 1fr));
  //   }
  // }`;

  insertCSS(
    `.bookmarks-cols{grid-template-columns:1fr 1fr;}@media (min-width: 768px){.bookmarks-cols{grid-template-columns:repeat(${config.bookmarks.userDefinedCols}, minmax(0, 1fr));}}`,
    "bookmarks-cols-style"
  );

  const rootFolderUUID = genid();
  const rootFolderAreaEl = createFolderArea(rootFolderUUID, true);
  const frag = document.createDocumentFragment();
  frag.appendChild(rootFolderAreaEl);
  bookmarksContainerEl.appendChild(frag);

  initBookmarkRenderRuntime(rootFolderAreaEl, config);

  renderBookmarkNodes(
    config.bookmarks.userDefined,
    rootFolderAreaEl,
    config.animations.enabled,
    config
  );
};
