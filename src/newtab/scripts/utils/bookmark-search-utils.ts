import { BookmarksType, Config } from "src/newtab/scripts/config";
import {
  bookmarksContainerEl,
  bookmarkSearchContainerEl,
  bookmarkSearchInputEl,
  bookmarkSearchResultsContainerEl,
  bookmarkSearchSectionEl,
  searchContainerEl,
  searchSectionEl
} from "src/newtab/scripts/ui";

export const tryFocusBookmarkSearch = (config: Config, e: KeyboardEvent) => {
  // in case already focused
  if (bookmarkSearchInputEl.matches(":focus")) return;

  focusBookmarkSearch(config, e);
};

export const focusBookmarkSearch = (config: Config, e: Event) => {
  bookmarkSearchContainerEl.classList.remove("border-transparent");
  bookmarkSearchContainerEl.style.borderColor = config.search.focusedBorderColor;

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
  bookmarks: any[],
  bookmarksType: BookmarksType,
  textColor: string,
  placeholderTextColor: string
) => {
  searchSectionEl.classList.replace("grid", "hidden");
  bookmarkSearchSectionEl.classList.replace("hidden", "grid");

  refreshBookmarkSearchResults(bookmarks, bookmarksType, textColor, placeholderTextColor);
};

export const disableSearchBookmark = () => {
  bookmarkSearchSectionEl.classList.replace("grid", "hidden");
  searchSectionEl.classList.replace("hidden", "grid");

  bookmarkSearchResultsContainerEl.innerHTML = "";
};

export const refreshBookmarkSearchResults = (
  bookmarks: any[],
  bookmarksType: BookmarksType,
  textColor: string,
  placeholderTextColor: string
) => {
  bookmarkSearchResultsContainerEl.innerHTML = "";

  // prettier-ignore
  let selectedIndex = parseInt(bookmarkSearchResultsContainerEl.getAttribute("selected-index") as string);

  const bookmarkSearchValue = bookmarkSearchInputEl.value.toLowerCase();

  let filteredBookmarks = [];

  if (bookmarksType === "user-defined") {
    filteredBookmarks = fuzzySearchBookmark(bookmarkSearchValue, bookmarks).sort((a, b) => {
      const aContains = a.name.toLowerCase().startsWith(bookmarkSearchValue);
      const bContains = b.name.toLowerCase().startsWith(bookmarkSearchValue);
      return aContains === bContains ? 0 : aContains ? -1 : 1;
    });
  } else if (bookmarksType === "default" || bookmarksType === "default-blocky") {
    filteredBookmarks = fuzzySearchBookmark(bookmarkSearchValue, bookmarks).sort((a, b) => {
      const aContains = a.title.toLowerCase().startsWith(bookmarkSearchValue);
      const bContains = b.title.toLowerCase().startsWith(bookmarkSearchValue);
      return aContains === bContains ? 0 : aContains ? -1 : 1;
    });
  }

  // make sure selectedIndex is within filterbookmarks amount
  if (selectedIndex > filteredBookmarks.length - 1) selectedIndex = filteredBookmarks.length - 1;

  filteredBookmarks.forEach((bookmark, index) => {
    let bName = bookmarksType === "user-defined" ? bookmark.name : bookmark.title;

    const matchedNameHtml = getMatchedNameHtml(
      bName,
      bookmarkSearchValue,
      textColor,
      placeholderTextColor
    );

    if (index === selectedIndex) {
      // <div bookmark-result-url="${bookmark.url}">
      //   <span class="search-select-icon-color font-semibold">&nbsp;></span>
      //   ${matchedNameHtml}
      // </div>

      const divEl = document.createElement("div");
      divEl.setAttribute("bookmark-result-url", bookmark.url);
      const spanEl = document.createElement("span");
      spanEl.className = "search-select-icon-color font-semibold";
      spanEl.innerHTML = "&nbsp;> ";
      divEl.appendChild(spanEl);
      divEl.innerHTML += matchedNameHtml;
      bookmarkSearchResultsContainerEl.appendChild(divEl);
    } else {
      // <div bookmark-result-url="${bookmark.url}">&nbsp;&nbsp;&nbsp;${matchedNameHtml}</div>

      const divEl = document.createElement("div");
      divEl.setAttribute("bookmark-result-url", bookmark.url);
      divEl.innerHTML = "&nbsp;&nbsp;&nbsp;" + matchedNameHtml;
      bookmarkSearchResultsContainerEl.appendChild(divEl);
    }
  });

  if (filteredBookmarks.length === 0) {
    // <p class="text-center">No results!</p>

    const pEl = document.createElement("p");
    pEl.className = "text-center";
    pEl.textContent = "No results!";
    bookmarkSearchResultsContainerEl.appendChild(pEl);
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

const fuzzySearchBookmark = (search: string, bookmarks: any[]) => {
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
