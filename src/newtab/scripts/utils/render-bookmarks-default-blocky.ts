import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  buildChromeBookmarksTree,
  renderDefaultBlockyBookmarksNodes
} from "src/newtab/scripts/utils/bookmark-utils";
import { insertCss } from "src/newtab/scripts/utils/insert-css";
import { getUserAgent } from "src/util-scripts/user-agent";

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

  insertCss(
    `.default-blocky-bookmarks-cols{grid-template-columns:1fr 1fr;}@media (min-width: 768px){.default-blocky-bookmarks-cols{grid-template-columns:repeat(${config.bookmarks.defaultBlockyCols}, minmax(0, 1fr));}}`
  );

  chrome.bookmarks.search({}, (chromeBookmarks) => {
    let chromeBookmarksTree = buildChromeBookmarksTree(chromeBookmarks);

    let location = "";

    if (config.bookmarks.bookmarksLocationFirefox === "menu") location = "menu________";
    else if (config.bookmarks.bookmarksLocationFirefox === "toolbar") location = "toolbar_____";
    else if (config.bookmarks.bookmarksLocationFirefox === "other") location = "unfiled_____";

    const userAgent = getUserAgent();
    if (userAgent === "firefox") {
      // prettier-ignore
      chromeBookmarksTree = chromeBookmarksTree.find((cb) => cb.id === location)!.children as unknown as chrome.bookmarks.BookmarkTreeNode[];
    }

    renderDefaultBlockyBookmarksNodes(
      chromeBookmarksTree[0].parentId!,
      chromeBookmarksTree,
      chromeBookmarks,
      config,
      false
    );
  });
};
