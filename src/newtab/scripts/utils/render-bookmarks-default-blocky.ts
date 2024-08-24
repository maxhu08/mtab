import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  bindActionsToBlockBookmark,
  buildChromeBookmarksTree,
  renderBlockBookmark,
  renderBlockBookmarkFolder,
  renderDefaultBlockyBookmarksNodes
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
    const chromeBookmarksTree = buildChromeBookmarksTree(chromeBookmarks);
    renderDefaultBlockyBookmarksNodes(chromeBookmarksTree, config);
  });
};
