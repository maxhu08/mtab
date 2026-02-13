import { BookmarkNodeBookmark, Config } from "src/utils/config";
import {
  bookmarkSearchInputEl,
  bookmarkSearchSectionEl,
  searchInputEl,
  searchResultsSectionEl
} from "src/newtab/scripts/ui";

import { focusSearch, openUrl, search, tryFocusSearch, unfocusSearch } from "./utils/search";
import {
  disableSearchBookmark,
  enableSearchBookmark,
  focusBookmarkSearch,
  tryFocusBookmarkSearch,
  unfocusBookmarkSearch
} from "src/newtab/scripts/utils/bookmarks/bookmark-search-utils";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/open-bookmark";
import { getBrowserFlattenedBookmarks } from "src/newtab/scripts/utils/bookmarks/bookmark-data-cache";
import { flattenBookmarks } from "src/newtab/scripts/utils/bookmarks/flatten-bookmarks";
import { handleSearchResultsNavigation } from "src/newtab/scripts/utils/search/handle-search-results";
import { recognizeUrl } from "src/newtab/scripts/utils/search/recognize-url";

export const listenToKeys = async (config: Config) => {
  let bookmarks: BookmarkNodeBookmark[] = [];

  if (config.bookmarks.type === "user-defined") {
    // flatten bookmarks and exclude folders
    bookmarks = flattenBookmarks(config.bookmarks.userDefined);
  } else {
    bookmarks = await getBrowserFlattenedBookmarks({
      bookmarksLocationFirefox: config.bookmarks.bookmarksLocationFirefox,
      defaultBlockyColorType: config.bookmarks.defaultBlockyColorType,
      defaultBlockyColor: config.bookmarks.defaultBlockyColor,
      defaultFaviconSource: config.bookmarks.defaultFaviconSource
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!config.hotkeys.enabled) return;

    const key = e.key.toLowerCase();

    // keybinds stuff

    // search
    if (key === "escape") unfocusSearch();
    const searchFocused = document.activeElement === searchInputEl;
    const bookmarkSearchFocused = document.activeElement === bookmarkSearchInputEl;

    if (key === config.hotkeys.activationKey.toLowerCase()) {
      if (bookmarkSearchSectionEl.classList.contains("grid")) {
        tryFocusBookmarkSearch(config.search.focusedBorderColor, e);
      } else {
        tryFocusSearch(config, e);
      }
    }

    if (
      key === config.hotkeys.closePageKey.toLowerCase() &&
      !searchFocused &&
      !bookmarkSearchFocused
    ) {
      window.close();
    }

    const inBookmarkSearch = bookmarkSearchSectionEl.classList.contains("grid");
    const searchResultsVisible = searchResultsSectionEl.classList.contains("block");

    // normal search suggestions navigation
    if (searchFocused && searchResultsVisible) {
      handleSearchResultsNavigation(searchInputEl, e, {
        resultUrlAttr: "search-result-url",
        onOpen: (value, openInNewTab) => {
          const direct = config.search.recognizeLinks ? recognizeUrl(value) : null;

          if (direct) {
            openUrl(config, direct, openInNewTab);
            return;
          }

          search(config, value, openInNewTab);
        }
      });
    }

    // bookmark search navigation (exclusive)
    if (inBookmarkSearch && searchResultsVisible) {
      handleSearchResultsNavigation(bookmarkSearchInputEl, e, {
        resultUrlAttr: "bookmark-result-url",
        onOpen: (url, openInNewTab) =>
          openBookmark(url, config.animations.enabled, config.animations.bookmarkType, openInNewTab)
      });
    }

    // bookmarks stuff
    if (
      config.bookmarks.type === "user-defined" ||
      config.bookmarks.type === "default" ||
      config.bookmarks.type === "default-blocky"
    ) {
      if (bookmarkSearchSectionEl.classList.contains("grid")) {
        if (key === "escape") {
          unfocusBookmarkSearch(config.animations.initialType);
          disableSearchBookmark();
          bookmarkSearchInputEl.value = "";
        }
      }

      if (
        key === config.hotkeys.searchBookmarksKey.toLowerCase() &&
        !searchFocused &&
        !bookmarkSearchFocused &&
        !bookmarkSearchSectionEl.classList.contains("grid")
      ) {
        enableSearchBookmark(
          bookmarks,
          config.search.textColor,
          config.search.placeholderTextColor,
          config.animations.enabled,
          config.animations.bookmarkType,
          "",
          false
        );
        tryFocusBookmarkSearch(config.search.focusedBorderColor, e);
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

      const raw = searchInputEl.value;
      const direct = config.search.recognizeLinks ? recognizeUrl(raw) : null;

      // open in new tab if ctrl
      if (e.ctrlKey) {
        if (direct) openUrl(config, direct, true);
        else search(config, raw, true);
        return;
      }

      if (direct) openUrl(config, direct, false);
      else search(config, raw, false);
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
      config.animations.bookmarkType,
      "",
      false
    );
  });
};
