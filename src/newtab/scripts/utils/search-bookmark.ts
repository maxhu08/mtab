import { UserDefinedBookmark } from "src/newtab/scripts/config";
import {
  bookmarkSearchSectionEl,
  searchSectionEl,
  bookmarkSearchResultsContainerEl,
  bookmarkSearchInputEl
} from "src/newtab/scripts/ui";

export const enableSearchBookmark = (
  bookmarks: UserDefinedBookmark[],
  placeholderTextColor: string
) => {
  searchSectionEl.classList.replace("grid", "hidden");
  bookmarkSearchSectionEl.classList.replace("hidden", "grid");

  refreshBookmarkSearchResults(bookmarks, placeholderTextColor);
};

export const disableSearchBookmark = () => {
  bookmarkSearchSectionEl.classList.replace("grid", "hidden");
  searchSectionEl.classList.replace("hidden", "grid");

  bookmarkSearchResultsContainerEl.innerHTML = "";
};

export const refreshBookmarkSearchResults = (
  bookmarks: UserDefinedBookmark[],
  placeholderTextColor: string
) => {
  bookmarkSearchResultsContainerEl.innerHTML = "";

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.name.includes(bookmarkSearchInputEl.value)
  );

  filteredBookmarks.forEach((bookmark, index) => {
    if (index === 0) {
      bookmarkSearchResultsContainerEl.innerHTML += `
        <div bookmark-result-url="${bookmark.url}">
          <span class="text-amber-500 font-semibold">&nbsp;></span>
          ${bookmark.name}
        </div>
      `;
    } else {
      bookmarkSearchResultsContainerEl.innerHTML += `
        <div bookmark-result-url="${bookmark.url}" style="color: ${placeholderTextColor};">&nbsp;&nbsp;&nbsp;${bookmark.name}</div>
      `;
    }
  });

  if (filteredBookmarks.length === 0) {
    bookmarkSearchResultsContainerEl.innerHTML += `
      <p class="text-center">No results!</p>
    `;
  }
};
