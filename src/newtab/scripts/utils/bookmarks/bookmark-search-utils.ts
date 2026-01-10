import { AnimationBookmarkType, BookmarkNodeBookmark } from "src/utils/config";
import {
  bookmarksContainerEl,
  bookmarkSearchContainerEl,
  bookmarkSearchInputEl,
  searchResultsContainerEl,
  bookmarkSearchSectionEl,
  searchContainerEl,
  searchSectionEl
} from "src/newtab/scripts/ui";

import {
  renderSearchResults,
  SearchResultItem
} from "src/newtab/scripts/utils/search/handle-search-results";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/open-bookmark";
import {
  showSearchResultsSection,
  hideSearchResultsSection
} from "src/newtab/scripts/utils/search/handle-search-suggestions";

export const tryFocusBookmarkSearch = (focusedBorderColor: string, e: KeyboardEvent) => {
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
  bookmarkAnimationType: AnimationBookmarkType,
  linkTextColor: string,
  recognizeLinks: boolean
) => {
  bookmarkSearchSectionEl.classList.replace("hidden", "grid");
  searchSectionEl.classList.replace("grid", "hidden");

  showSearchResultsSection();

  refreshBookmarkSearchResults(
    bookmarks,
    textColor,
    placeholderTextColor,
    animationsEnabled,
    bookmarkAnimationType,
    linkTextColor,
    recognizeLinks
  );
};

export const disableSearchBookmark = () => {
  bookmarkSearchSectionEl.classList.replace("grid", "hidden");
  searchSectionEl.classList.replace("hidden", "grid");

  // hide + clear
  hideSearchResultsSection();
  searchResultsContainerEl.innerHTML = "";
};

export const refreshBookmarkSearchResults = (
  bookmarks: BookmarkNodeBookmark[],
  textColor: string,
  placeholderTextColor: string,
  animationsEnabled: boolean,
  bookmarkAnimationType: AnimationBookmarkType,
  linkTextColor: string,
  recognizeLinks: boolean
) => {
  const bookmarkWithoutFolders = bookmarks
    .filter((bm) => bm.type === "bookmark")
    .map((bm) => ({ name: bm.name, value: bm.url, directLink: false }) satisfies SearchResultItem);

  if (bookmarkWithoutFolders.length === 0) {
    searchResultsContainerEl.innerHTML = "";
    hideSearchResultsSection();
    return;
  }

  showSearchResultsSection();

  renderSearchResults(bookmarkWithoutFolders, {
    inputEl: bookmarkSearchInputEl,
    textColor,
    placeholderTextColor,
    linkTextColor,
    recognizeLinks,
    resultUrlAttr: "bookmark-result-url",
    onOpen: (url, openInNewTab) => {
      openBookmark(url, animationsEnabled, bookmarkAnimationType, openInNewTab);

      if (openInNewTab) {
        refreshBookmarkSearchResults(
          bookmarks,
          textColor,
          placeholderTextColor,
          animationsEnabled,
          bookmarkAnimationType,
          linkTextColor,
          recognizeLinks
        );
      }
    }
  });
};
