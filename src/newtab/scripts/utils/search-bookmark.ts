import { UserDefinedBookmark } from "src/newtab/scripts/config";
import {
  bookmarkSearchSectionEl,
  searchSectionEl,
  bookmarkSearchResultsContainerEl,
  bookmarkSearchInputEl
} from "src/newtab/scripts/ui";

export const enableSearchBookmark = (
  bookmarks: UserDefinedBookmark[],
  textColor: string,
  placeholderTextColor: string
) => {
  searchSectionEl.classList.replace("grid", "hidden");
  bookmarkSearchSectionEl.classList.replace("hidden", "grid");

  refreshBookmarkSearchResults(bookmarks, textColor, placeholderTextColor);
};

export const disableSearchBookmark = () => {
  bookmarkSearchSectionEl.classList.replace("grid", "hidden");
  searchSectionEl.classList.replace("hidden", "grid");

  bookmarkSearchResultsContainerEl.innerHTML = "";
};

export const refreshBookmarkSearchResults = (
  bookmarks: UserDefinedBookmark[],
  textColor: string,
  placeholderTextColor: string
) => {
  bookmarkSearchResultsContainerEl.innerHTML = "";

  // prettier-ignore
  let selectedIndex = parseInt(bookmarkSearchResultsContainerEl.getAttribute("selected-index") as string);

  const bookmarkSearchValue = bookmarkSearchInputEl.value.toLowerCase();

  const filteredBookmarks = fuzzySearchBookmark(bookmarkSearchValue, bookmarks).sort((a, b) => {
    const aContains = a.name.toLowerCase().startsWith(bookmarkSearchValue);
    const bContains = b.name.toLowerCase().startsWith(bookmarkSearchValue);
    return aContains === bContains ? 0 : aContains ? -1 : 1;
  });

  // make sure selectedIndex is within filterbookmarks amount
  if (selectedIndex > filteredBookmarks.length - 1) selectedIndex = filteredBookmarks.length - 1;

  filteredBookmarks.forEach((bookmark, index) => {
    const matchedNameHtml = getMatchedNameHtml(
      bookmark.name,
      bookmarkSearchValue,
      textColor,
      placeholderTextColor
    );

    if (index === selectedIndex) {
      bookmarkSearchResultsContainerEl.innerHTML += `
        <div bookmark-result-url="${bookmark.url}">
          <span class="search-select-icon-color font-semibold">&nbsp;></span>
          ${matchedNameHtml}
        </div>
      `;
    } else {
      bookmarkSearchResultsContainerEl.innerHTML += `
        <div bookmark-result-url="${bookmark.url}">&nbsp;&nbsp;&nbsp;${matchedNameHtml}</div>
      `;
    }
  });

  if (filteredBookmarks.length === 0) {
    bookmarkSearchResultsContainerEl.innerHTML += `
      <p class="text-center">No results!</p>
    `;
  }
};

const getMatchedNameHtml = (
  name: string,
  searchValue: string,
  textColor: string,
  placeholderTextColor: string
) => {
  let result = "";
  let searchIndex = 0;

  for (let i = 0; i < name.length; i++) {
    if (
      searchIndex < searchValue.length &&
      name[i].toLowerCase() === searchValue[searchIndex].toLowerCase()
    ) {
      result += `<span style="color: ${textColor};">${name[i]}</span>`;
      searchIndex++;
    } else {
      result += `<span style="color: ${placeholderTextColor};">${name[i]}</span>`;
    }
  }

  return result;
};

const fuzzySearchBookmark = (search: string, bookmarks: UserDefinedBookmark[]) => {
  if (search === "") {
    const results = bookmarks;
    return results;
  }

  const results = bookmarks.filter((bookmark) => {
    let searchIndex = 0;

    for (let i = 0; i < bookmark.name.length; i++) {
      if (bookmark.name[i].toLowerCase() === search[searchIndex].toLowerCase()) {
        searchIndex++;
      }
      if (searchIndex === search.length) {
        return true;
      }
    }

    return false;
  });

  return results;
};
