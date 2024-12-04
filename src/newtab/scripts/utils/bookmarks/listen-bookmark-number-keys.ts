import { BookmarksType } from "src/newtab/scripts/config";
import { bookmarksContainerEl, bookmarkSearchInputEl, searchInputEl } from "src/newtab/scripts/ui";

export const listenBookmarkNumberKeys = (listen: boolean, bookmarksType: BookmarksType) => {
  if (bookmarksType !== "user-defined" && bookmarksType !== "default-blocky") return;
  if (!listen) return;

  document.addEventListener("keypress", (e) => {
    const searchFocused = document.activeElement === searchInputEl;
    const bookmarkSearchFocused = document.activeElement === bookmarkSearchInputEl;

    if (!searchFocused && !bookmarkSearchFocused) {
      const key = e.key;

      // check if the key is a number between 1 and 9
      if (key >= "1" && key <= "9") {
        const index = parseInt(key, 10) - 1;

        // prettier-ignore
        const currFolderAreaEl = bookmarksContainerEl.querySelector('[folder-state="open"]') as HTMLDivElement;

        if (index < currFolderAreaEl.children[0].children.length) {
          const nthBookmark = currFolderAreaEl.children[0].children[index] as HTMLButtonElement;

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
