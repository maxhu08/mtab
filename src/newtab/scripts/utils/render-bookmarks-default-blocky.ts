import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  bindActionsToBlockBookmark,
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

      console.log(bookmark.title, folderChildren);

      folderChildren.forEach((bookmark, index) => {
        renderBlockBookmark(
          config.animations.bookmarkTiming,
          config.bookmarks.userDefined.length,
          index,
          bookmark.id,
          config.bookmarks.defaultBlockyColor,
          null,
          null,
          // prettier-ignore
          `<img class="w-10 md:w-14" src="${`chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(bookmark.url as string)}&size=${64}`}" />`,
          config.ui.style,
          config.animations.enabled,
          config.animations.initialType
        );
      });

      config.animations &&
        folderChildren.forEach((bookmark, index) => {
          console.log("SOmething", index);
          bindActionsToBlockBookmark(
            bookmark.id,
            index,
            bookmark.url!,
            config.animations.enabled,
            config.animations.initialType,
            config.animations.bookmarkType
          );
        });
    });

    // chromeBookmarks.forEach((bookmark, index) => {
    //   // prettier-ignore
    //   const bookmarkEl = document.getElementById(`bookmark-${bookmark.id}-${index}`) as HTMLDivElement;
    //   // prettier-ignore
    //   const bookmarkBorderEl = document.getElementById(`bookmark-${bookmark.id}-${index}-border`) as HTMLDivElement;

    //   bookmarkEl.addEventListener("blur", () => unfocusBookmark(bookmarkBorderEl));
    //   bookmarkEl.addEventListener("focus", (e) => focusBookmark(bookmarkBorderEl, config, e));
    // });
  });
};
