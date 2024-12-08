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
  bookmarks: any[],
  textColor: string,
  placeholderTextColor: string
) => {
  bookmarkSearchResultsContainerEl.innerHTML = "";

  // prettier-ignore
  let selectedIndex = parseInt(bookmarkSearchResultsContainerEl.getAttribute("selected-index") as string);

  const bookmarkSearchValue = bookmarkSearchInputEl.value.toLowerCase();
  const bookmarkWithoutFolders = bookmarks.filter((bm) => bm.type === "bookmark");

  let filteredBookmarks = [];

  filteredBookmarks = fuzzySearchBookmark(bookmarkSearchValue, bookmarkWithoutFolders).sort(
    (a, b) => {
      const aContains = a.name.toLowerCase().startsWith(bookmarkSearchValue);
      const bContains = b.name.toLowerCase().startsWith(bookmarkSearchValue);
      return aContains === bContains ? 0 : aContains ? -1 : 1;
    }
  );

  // make sure selectedIndex is within filterbookmarks amount
  if (selectedIndex > filteredBookmarks.length - 1) selectedIndex = filteredBookmarks.length - 1;

  filteredBookmarks.forEach((bookmark, index) => {
    const bName = bookmark.name;

    const matchedNameHtml = getMatchedNameHtml(
      bName,
      bookmarkSearchValue,
      textColor,
      placeholderTextColor
    );

    if (index === selectedIndex) {
      // <div bookmark-result-url="${bookmark.url}" class="grid grid-cols-[max-content_auto]">
      //   <span class="search-select-icon-color font-semibold">&nbsp;>&nbsp;</span>
      //   <div class="truncate" style="color:${placeholderTextColor}">${matchedNameHtml}</div>
      // </div>

      const divEl = document.createElement("div");
      divEl.setAttribute("bookmark-result-url", bookmark.url);
      divEl.className = "grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "search-select-icon-color font-semibold";
      spanEl.innerHTML = "&nbsp;>&nbsp;";

      const contentDivEl = document.createElement("div");
      contentDivEl.className = "truncate";
      contentDivEl.style.color = placeholderTextColor;
      contentDivEl.innerHTML = matchedNameHtml;

      divEl.appendChild(spanEl);
      divEl.appendChild(contentDivEl);

      bookmarkSearchResultsContainerEl.appendChild(divEl);
    } else {
      // <div bookmark-result-url="${bookmark.url}" class="grid grid-cols-[max-content_auto]">
      //   <div>&nbsp;&nbsp;&nbsp;</div>
      //   <div class="truncate" style="color:${placeholderTextColor}">${matchedNameHtml}</div>
      // </div>

      const divEl = document.createElement("div");
      divEl.setAttribute("bookmark-result-url", bookmark.url);
      divEl.className = "grid grid-cols-[max-content_auto]";

      const placeholderDivEl = document.createElement("div");
      placeholderDivEl.innerHTML = "&nbsp;&nbsp;&nbsp;";

      const contentDivEl = document.createElement("div");
      contentDivEl.className = "truncate";
      contentDivEl.style.color = placeholderTextColor;
      contentDivEl.innerHTML = matchedNameHtml;

      divEl.appendChild(placeholderDivEl);
      divEl.appendChild(contentDivEl);

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
  if (search === "") return bookmarks;

  const results = bookmarks.filter((bookmark) => {
    let searchIndex = 0;
    const bName = bookmark.name;

    for (let i = 0; i < bName.length; i++) {
      if (bName[i].toLowerCase() === search[searchIndex].toLowerCase()) {
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
