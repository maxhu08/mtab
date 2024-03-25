import { Config } from "src/newtab/scripts/config";
import { bookmarksOptionsContainerEl } from "src/options/scripts/ui";

export const fillBookmarksInputs = (config: Config) => {
  config.bookmarks.forEach((bookmark) => {
    bookmarksOptionsContainerEl.innerHTML += `
    <div>${bookmark.name}</div>
    `;
  });
};
