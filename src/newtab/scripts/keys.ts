// ui
import { Config } from "src/newtab/scripts/config";
import {
  bookmarkSearchInputEl,
  bookmarkSearchResultsContainerEl,
  bookmarkSearchSectionEl,
  searchInputEl
} from "src/newtab/scripts/ui";

// utils
import { focusSearch, search, tryFocusSearch, unfocusSearch } from "./utils/search";
import {
  disableSearchBookmark,
  enableSearchBookmark,
  focusBookmarkSearch,
  refreshBookmarkSearchResults,
  tryFocusBookmarkSearch,
  unfocusBookmarkSearch
} from "src/newtab/scripts/utils/bookmark-search-utils";
import { openBookmark } from "src/newtab/scripts/utils/bookmark-utils";
// import { navigateTab } from "src/newtab/scripts/utils/navigate-tab";

export const listenToKeys = (config: Config) => {
  document.addEventListener("keydown", (e) => {
    if (!config.hotkeys.enabled) return;

    // keybinds stuff

    // search
    if (e.key === "Escape") unfocusSearch();
    const searchFocused = document.activeElement === searchInputEl;
    const bookmarkSearchFocused = document.activeElement === bookmarkSearchInputEl;

    if (e.key === config.hotkeys.activationKey) {
      if (bookmarkSearchSectionEl.classList.contains("grid")) {
        tryFocusBookmarkSearch(config, e);
      } else {
        tryFocusSearch(config, e);
      }
    }
    if (e.key === config.hotkeys.closePageKey && !searchFocused && !bookmarkSearchFocused)
      window.close();

    // bookmarks stuff
    if (config.bookmarks.type === "user-defined") {
      // if search bookmark is on already (grid)
      if (bookmarkSearchSectionEl.classList.contains("grid")) {
        if (e.key === "Escape") {
          unfocusBookmarkSearch(config.animations.initialType);
          disableSearchBookmark();
          bookmarkSearchInputEl.value = "";
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const results = bookmarkSearchResultsContainerEl.children.length;

          // prettier-ignore
          const prevIndex = parseInt(bookmarkSearchResultsContainerEl.getAttribute("selected-index") as string);
          // prettier-ignore
          if (prevIndex < results - 1) {
            bookmarkSearchResultsContainerEl.setAttribute("selected-index", ((prevIndex) + 1).toString());
          } else {
            bookmarkSearchResultsContainerEl.setAttribute("selected-index", (0).toString());
          }

          refreshBookmarkSearchResults(
            config.bookmarks.userDefined,
            config.search.textColor,
            config.search.placeholderTextColor
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const results = bookmarkSearchResultsContainerEl.children.length;

          // prettier-ignore
          const prevIndex = parseInt(bookmarkSearchResultsContainerEl.getAttribute("selected-index") as string);
          // prettier-ignore
          if (prevIndex > 0) {
            bookmarkSearchResultsContainerEl.setAttribute("selected-index", ((prevIndex) - 1).toString());
          } else {
            bookmarkSearchResultsContainerEl.setAttribute("selected-index", (results - 1).toString());
          }

          refreshBookmarkSearchResults(
            config.bookmarks.userDefined,
            config.search.textColor,
            config.search.placeholderTextColor
          );
        }
      }

      if (
        e.key === config.hotkeys.searchBookmarksKey &&
        !searchFocused &&
        !bookmarkSearchFocused &&
        !bookmarkSearchSectionEl.classList.contains("grid")
      ) {
        enableSearchBookmark(
          config.bookmarks.userDefined,
          config.search.textColor,
          config.search.placeholderTextColor
        );
        tryFocusBookmarkSearch(config, e);
      }
    }

    // nav stuff
    // if (e.key === "J") navigateTab("left");
    // if (e.key === "K") navigateTab("right");
  });

  searchInputEl.addEventListener("blur", () => unfocusSearch());

  searchInputEl.addEventListener("focus", (e) => focusSearch(config, e));

  searchInputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (searchInputEl.value === "") return;

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

  bookmarkSearchInputEl.addEventListener("blur", () =>
    unfocusBookmarkSearch(config.animations.initialType)
  );

  bookmarkSearchInputEl.addEventListener("focus", (e) => focusBookmarkSearch(config, e));

  bookmarkSearchInputEl.addEventListener("keyup", (e) => {
    enableSearchBookmark(
      config.bookmarks.userDefined,
      config.search.textColor,
      config.search.placeholderTextColor
    );

    if (e.key === "Enter") {
      e.preventDefault();

      // prettier-ignore
      const resultIndex = parseInt(bookmarkSearchResultsContainerEl.getAttribute("selected-index") as string);
      // prettier-ignore
      const bookmarkUrl = bookmarkSearchResultsContainerEl.children[resultIndex].getAttribute("bookmark-result-url") as string;
      if (!bookmarkUrl) return;

      // open in new tab if ctrl
      if (e.ctrlKey) {
        openBookmark(bookmarkUrl, config.animations.enabled, config.animations.bookmarkType, true);
        return;
      }

      openBookmark(bookmarkUrl, config.animations.enabled, config.animations.bookmarkType);
    }
  });
};
