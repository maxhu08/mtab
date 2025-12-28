// ui
import { BookmarkNodeBookmark, Config } from "src/utils/config";
import {
  bookmarkSearchInputEl,
  searchResultsContainerEl,
  bookmarkSearchSectionEl,
  searchInputEl
} from "src/newtab/scripts/ui";

// utils
import { focusSearch, search, tryFocusSearch, unfocusSearch } from "./utils/search";
import {
  disableSearchBookmark,
  enableSearchBookmark,
  focusBookmarkSearch,
  tryFocusBookmarkSearch,
  unfocusBookmarkSearch
} from "src/newtab/scripts/utils/bookmarks/bookmark-search-utils";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/open-bookmark";
import { convertBrowserBookmarksToBookmarkNodes } from "src/newtab/scripts/utils/bookmarks/convert-browser-bookmarks";
import { flattenBookmarks } from "src/newtab/scripts/utils/bookmarks/flatten-bookmarks";
import { handleSearchResultsNavigation } from "src/newtab/scripts/utils/search/handle-search-results";

export const listenToKeys = async (config: Config) => {
  let bookmarks: BookmarkNodeBookmark[] = [];

  if (config.bookmarks.type === "user-defined") {
    // flatten bookmarks and exclude folders
    bookmarks = flattenBookmarks(config.bookmarks.userDefined);
  } else {
    const bookmarkNodes = await convertBrowserBookmarksToBookmarkNodes(
      config.bookmarks.bookmarksLocationFirefox,
      config.bookmarks.defaultBlockyColorType,
      config.bookmarks.defaultBlockyColor,
      config.bookmarks.defaultFaviconSource
    );

    // flatten bookmarks and exclude folders
    bookmarks = flattenBookmarks(bookmarkNodes);
  }

  document.addEventListener("keydown", (e) => {
    if (!config.hotkeys.enabled) return;

    // keybinds stuff

    // search
    if (e.key === "Escape") unfocusSearch();
    const searchFocused = document.activeElement === searchInputEl;
    const bookmarkSearchFocused = document.activeElement === bookmarkSearchInputEl;

    if (e.key === config.hotkeys.activationKey) {
      if (bookmarkSearchSectionEl.classList.contains("grid")) {
        tryFocusBookmarkSearch(config.search.focusedBorderColor, e);
      } else {
        tryFocusSearch(config, e);
      }
    }
    if (e.key === config.hotkeys.closePageKey && !searchFocused && !bookmarkSearchFocused)
      window.close();

    // bookmarks stuff
    if (
      config.bookmarks.type === "user-defined" ||
      config.bookmarks.type === "default" ||
      config.bookmarks.type === "default-blocky"
    ) {
      // if search bookmark is on already (grid)
      if (bookmarkSearchSectionEl.classList.contains("grid")) {
        handleSearchResultsNavigation(e, {
          resultsContainerEl: searchResultsContainerEl,
          selectedIndexAttr: "selected-index",
          resultUrlAttr: "bookmark-result-url",
          refreshResults: () =>
            enableSearchBookmark(
              bookmarks,
              config.search.textColor,
              config.search.placeholderTextColor,
              config.animations.enabled,
              config.animations.bookmarkType
            ),
          onOpen: (url, openInNewTab) =>
            openBookmark(
              url,
              config.animations.enabled,
              config.animations.bookmarkType,
              openInNewTab
            )
        });

        if (e.key === "Escape") {
          unfocusBookmarkSearch(config.animations.initialType);
          disableSearchBookmark();
          bookmarkSearchInputEl.value = "";
        }
      }

      if (
        e.key === config.hotkeys.searchBookmarksKey &&
        !searchFocused &&
        !bookmarkSearchFocused &&
        !bookmarkSearchSectionEl.classList.contains("grid")
      ) {
        (enableSearchBookmark(
          bookmarks,
          config.search.textColor,
          config.search.placeholderTextColor,
          config.animations.enabled,
          config.animations.bookmarkType
        ),
          tryFocusBookmarkSearch(config.search.focusedBorderColor, e));
      }
    }
  });

  let isComposing = false;

  function addCompositionListeners(element: HTMLElement) {
    element.addEventListener("compositionstart", () => {
      isComposing = true;
    });

    element.addEventListener("compositionend", () => {
      isComposing = false;
    });
  }

  addCompositionListeners(searchInputEl);
  addCompositionListeners(bookmarkSearchInputEl);

  searchInputEl.addEventListener("blur", () => {
    // prevent getting unfocused on window unfocus
    if (document.hasFocus()) unfocusSearch();
  });

  searchInputEl.addEventListener("focus", (e) => focusSearch(config, e));

  searchInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.repeat) {
      e.preventDefault();

      // do not search if composition is still in progress
      if (isComposing || searchInputEl.value === "") return;

      // open in new tab if ctrl
      if (e.ctrlKey) {
        search(config, searchInputEl.value, true);
        return;
      }

      search(config, searchInputEl.value);
    }
  });

  searchInputEl.addEventListener("input", () => {
    if (!config.title.dynamic.enabled) return;

    // not empty or just spaces
    if (searchInputEl.value !== "" && !/^\s*$/.test(searchInputEl.value))
      document.title = searchInputEl.value;
    else document.title = config.title.defaultTitle;
  });

  bookmarkSearchInputEl.addEventListener("blur", () => {
    // prevent getting unfocused on window unfocus
    if (document.hasFocus()) unfocusBookmarkSearch(config.animations.initialType);
  });

  bookmarkSearchInputEl.addEventListener("focus", (e) =>
    focusBookmarkSearch(config.search.focusedBorderColor, e)
  );

  bookmarkSearchInputEl.addEventListener("keyup", () => {
    enableSearchBookmark(
      bookmarks,
      config.search.textColor,
      config.search.placeholderTextColor,
      config.animations.enabled,
      config.animations.bookmarkType
    );
  });
};
