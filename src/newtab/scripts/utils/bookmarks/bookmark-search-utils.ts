import { AnimationBookmarkType, BookmarkNodeBookmark } from "src/utils/config";
import {
  bookmarksContainerEl,
  bookmarkSearchContainerEl,
  bookmarkSearchInputEl,
  searchResultsContainerEl,
  bookmarkSearchSectionEl,
  searchContainerEl,
  searchSectionEl,
  searchResultsSectionEl
} from "src/newtab/scripts/ui";

import { renderSearchResults } from "src/newtab/scripts/utils/search/handle-search-results";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/open-bookmark";

type SearchResultItem = {
  name: string;
  url: string;
};

export const tryFocusBookmarkSearch = (focusedBorderColor: string, e: KeyboardEvent) => {
  // in case already focused
  if (bookmarkSearchInputEl.matches(":focus")) return;

  focusBookmarkSearch(focusedBorderColor, e);
};

export const focusBookmarkSearch = (focusedBorderColor: string, e: Event) => {
  bookmarkSearchContainerEl.classList.remove("border-transparent");
  bookmarkSearchContainerEl.style.borderColor = focusedBorderColor;

  bookmarkSearchInputEl.focus();
  e.preventDefault();
};

export const unfocusBookmarkSearch = (animationType: string) => {
  bookmarkSearchInputEl.blur();

  bookmarkSearchContainerEl.style.borderColor = "#00000000";
  bookmarkSearchContainerEl.classList.add("border-transparent");

  // hide results section when leaving bookmark search
  searchResultsSectionEl.classList.replace("grid", "hidden");

  searchContainerEl.classList.remove(animationType);

  const bookmarkEls = bookmarksContainerEl.children;
  for (let i = 0; i < bookmarkEls.length; i++) {
    const bookmarkEl = bookmarkEls[i];
    bookmarkEl.classList.remove(animationType);
    bookmarkEl.classList.remove("opacity-0");
  }
};

export const enableSearchBookmark = (
  bookmarks: BookmarkNodeBookmark[],
  textColor: string,
  placeholderTextColor: string,
  animationsEnabled: boolean,
  bookmarkAnimationType: AnimationBookmarkType
) => {
  searchSectionEl.classList.replace("grid", "hidden");
  bookmarkSearchSectionEl.classList.replace("hidden", "grid");

  searchResultsSectionEl.classList.replace("grid", "hidden");

  refreshBookmarkSearchResults(
    bookmarks,
    textColor,
    placeholderTextColor,
    animationsEnabled,
    bookmarkAnimationType
  );
};

export const disableSearchBookmark = () => {
  bookmarkSearchSectionEl.classList.replace("grid", "hidden");
  searchSectionEl.classList.replace("hidden", "grid");

  // hide + clear
  searchResultsSectionEl.classList.replace("grid", "hidden");
  searchResultsContainerEl.innerHTML = "";
};

export const refreshBookmarkSearchResults = (
  bookmarks: BookmarkNodeBookmark[],
  textColor: string,
  placeholderTextColor: string,
  animationsEnabled: boolean,
  bookmarkAnimationType: AnimationBookmarkType
) => {
  const bookmarkWithoutFolders = bookmarks
    .filter((bm) => bm.type === "bookmark")
    .map((bm) => ({ name: bm.name, url: bm.url }) satisfies SearchResultItem);

  renderSearchResults(bookmarkWithoutFolders, {
    resultsContainerEl: searchResultsContainerEl,
    inputEl: bookmarkSearchInputEl,
    textColor,
    placeholderTextColor,
    resultUrlAttr: "bookmark-result-url",
    selectedIndexAttr: "selected-index",
    resultsSectionEl: searchResultsSectionEl,
    maxResults: 8,
    onOpen: (url, openInNewTab) => {
      openBookmark(url, animationsEnabled, bookmarkAnimationType, openInNewTab);

      if (openInNewTab)
        refreshBookmarkSearchResults(
          bookmarks,
          textColor,
          placeholderTextColor,
          animationsEnabled,
          bookmarkAnimationType
        );
    }
  });
};
