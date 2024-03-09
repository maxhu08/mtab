import { Config } from "src/scripts/config";
import { bookmarksContainerEl } from "src/scripts/ui";

export const renderBookmarks = (bookmarks: Config["bookmarks"]) => {
  bookmarks.forEach((bookmark, index) => {
    bookmarksContainerEl.innerHTML += `<div class="bg-neutral-800 rounded-md p-1 md:p-2 h-20 md:h-32 overflow-hidden">
      <span>${bookmark.name}</span>
      <span>${bookmark.url}</span>
      <span>${bookmark.activationKey}</span>
    </div>
    `;

    console.log(bookmark);
  });
};
