import { UserDefinedBookmark } from "src/newtab/scripts/config";
import {
  bookmarkSearchSectionEl,
  searchSectionEl,
  bookmarkSearchResultsContainerEl
} from "src/newtab/scripts/ui";

export const enableSearchBookmark = (bookmarks: UserDefinedBookmark[]) => {
  searchSectionEl.classList.replace("grid", "hidden");
  bookmarkSearchSectionEl.classList.replace("hidden", "grid");

  bookmarks.forEach((bookmark) => {
    bookmarkSearchResultsContainerEl.innerHTML += `${bookmark.name}<br/>`;
  });
};

export const disableSearchBookmark = () => {
  bookmarkSearchSectionEl.classList.replace("grid", "hidden");
  searchSectionEl.classList.replace("hidden", "grid");
};
