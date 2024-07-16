import { UserDefinedBookmark } from "src/newtab/scripts/config";
import {
  bookmarkSearchSectionEl,
  searchSectionEl,
  bookmarkSearchResultsContainerEl,
  bookmarkSearchInputEl
} from "src/newtab/scripts/ui";

export const enableSearchBookmark = (bookmarks: UserDefinedBookmark[]) => {
  searchSectionEl.classList.replace("grid", "hidden");
  bookmarkSearchSectionEl.classList.replace("hidden", "grid");

  refreshBookmarkSearchResults(bookmarks);
};

export const disableSearchBookmark = () => {
  bookmarkSearchSectionEl.classList.replace("grid", "hidden");
  searchSectionEl.classList.replace("hidden", "grid");

  bookmarkSearchResultsContainerEl.innerHTML = "";
};

export const refreshBookmarkSearchResults = (bookmarks: UserDefinedBookmark[]) => {
  bookmarkSearchResultsContainerEl.innerHTML = "";

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.name.includes(bookmarkSearchInputEl.value)
  );

  filteredBookmarks.forEach((bookmark, index) => {
    if (index === 0) {
      bookmarkSearchResultsContainerEl.innerHTML += `
        <div>
          <span>></span>
          ${bookmark.name}
        </div>
      `;
    } else {
      bookmarkSearchResultsContainerEl.innerHTML += `
        <div>${bookmark.name}</div>
      `;
    }
  });
};
