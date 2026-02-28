import { BookmarksType } from "~/src/utils/config";
import {
  bookmarksContainerEl,
  bookmarkSearchInputEl,
  searchInputEl
} from "~/src/newtab/scripts/ui";
import { getOpenFolderVisibleBookmarkButtons } from "~/src/newtab/scripts/utils/bookmarks/bookmark-render-utils";

export const listenBookmarkNumberKeys = (listen: boolean, bookmarksType: BookmarksType) => {
  if (bookmarksType !== "user-defined" && bookmarksType !== "default-blocky") return;
  if (!listen) return;

  document.addEventListener("keypress", (e) => {
    const searchFocused = document.activeElement === searchInputEl;
    const bookmarkSearchFocused = document.activeElement === bookmarkSearchInputEl;

    if (!searchFocused && !bookmarkSearchFocused) {
      const key = e.key;

      if (key === "0") {
        // prettier-ignore
        const currFolderAreaEl = bookmarksContainerEl.querySelector('[folder-state="open"]') as HTMLDivElement;
        const backButtonEl = currFolderAreaEl.children[1].children[0] as HTMLButtonElement;

        backButtonEl.click();
      } // check if the key is a number between 1 and 9
      else if (key >= "1" && key <= "9") {
        const index = parseInt(key, 10) - 1;
        const visibleBookmarks = getOpenFolderVisibleBookmarkButtons();
        if (index < visibleBookmarks.length) {
          const nthBookmark = visibleBookmarks[index];

          const mouseEvent = new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0, // left click by default
            ctrlKey: false // no Ctrl key by default
          });

          nthBookmark.dispatchEvent(mouseEvent);
        }
      }
    }
  });
};
