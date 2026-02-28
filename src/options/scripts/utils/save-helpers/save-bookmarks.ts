import {
  Config,
  BookmarksType,
  BookmarksLocationFirefox,
  DefaultBlockyColorType,
  DefaultFaviconSource,
  BookmarkLineOrientation
} from "~/src/utils/config";
import {
  bookmarksDefaultBlockyColorInputEl,
  bookmarksDefaultBlockyColsInputEl,
  bookmarksDefaultFolderIconTypeInputEl,
  bookmarksDefaultIconColorInputEl,
  bookmarksEnablePaginationCheckboxEl,
  bookmarksMaxBookmarkRowsPerPageInputEl,
  bookmarksNumberKeysCheckboxEl,
  bookmarksShowBookmarkNamesCheckboxEl
} from "~/src/options/scripts/ui";
import { saveBookmarkNodeBookmarkSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-user-defined-bookmarks";
import { getSelectedButton } from "~/src/options/scripts/utils/get-selected-button";

export const saveBookmarksSettingsToDraft = (draft: Config) => {
  draft.bookmarks.showBookmarkNames = bookmarksShowBookmarkNamesCheckboxEl.checked;

  draft.bookmarks.defaultBlockyCols = Math.max(
    1,
    Number.parseInt(bookmarksDefaultBlockyColsInputEl.value, 10) || 1
  );
  draft.bookmarks.defaultBlockyColor = bookmarksDefaultBlockyColorInputEl.value;

  draft.bookmarks.numberKeys = bookmarksNumberKeysCheckboxEl.checked;
  draft.bookmarks.enablePagination = bookmarksEnablePaginationCheckboxEl.checked;
  draft.bookmarks.maxBookmarkRowsPerPage = Math.max(
    1,
    Number.parseInt(bookmarksMaxBookmarkRowsPerPageInputEl.value, 10) || 1
  );
  draft.bookmarks.defaultIconColor = bookmarksDefaultIconColorInputEl.value;
  draft.bookmarks.defaultFolderIconType = bookmarksDefaultFolderIconTypeInputEl.value;

  const selectedTypeEl = getSelectedButton("bookmarks-type");
  const bookmarksTypePairs: Record<string, BookmarksType> = {
    "bookmarks-type-user-defined-button": "user-defined",
    "bookmarks-type-default-button": "default",
    "bookmarks-type-default-blocky-button": "default-blocky",
    "bookmarks-type-none-button": "none"
  };
  if (selectedTypeEl) {
    draft.bookmarks.type = bookmarksTypePairs[selectedTypeEl.id];
  }

  const selectedLineOrientation = getSelectedButton("bookmarks-line-orientation");
  const bookmarksLineOrientationPairs: Record<string, BookmarkLineOrientation> = {
    "bookmarks-line-orientation-top-button": "top",
    "bookmarks-line-orientation-bottom-button": "bottom",
    "bookmarks-line-orientation-left-button": "left",
    "bookmarks-line-orientation-right-button": "right",
    "bookmarks-line-orientation-none-button": "none"
  };
  if (selectedLineOrientation) {
    draft.bookmarks.lineOrientation = bookmarksLineOrientationPairs[selectedLineOrientation.id];
  }

  const selectedDefaultBlockyColorType = getSelectedButton("bookmarks-default-blocky-color-type");
  const bookmarksDefaultBlockyColorTypePairs: Record<string, DefaultBlockyColorType> = {
    "bookmarks-default-blocky-color-type-random-button": "random",
    "bookmarks-default-blocky-color-type-custom-button": "custom"
  };
  if (selectedDefaultBlockyColorType) {
    draft.bookmarks.defaultBlockyColorType =
      bookmarksDefaultBlockyColorTypePairs[selectedDefaultBlockyColorType.id];
  }

  const selectedLocationFirefoxEl = getSelectedButton("bookmarks-location-firefox");
  const bookmarksLocationFirefoxPairs: Record<string, BookmarksLocationFirefox> = {
    "bookmarks-location-firefox-menu-button": "menu",
    "bookmarks-location-firefox-toolbar-button": "toolbar",
    "bookmarks-location-firefox-other-button": "other"
  };
  if (selectedLocationFirefoxEl) {
    draft.bookmarks.bookmarksLocationFirefox =
      bookmarksLocationFirefoxPairs[selectedLocationFirefoxEl.id];
  }

  const selectedDefaultFaviconSourceEl = getSelectedButton("bookmarks-default-favicon-source");
  const bookmarksDefaultFaviconSourcePairs: Record<string, DefaultFaviconSource> = {
    "bookmarks-default-favicon-source-google-button": "google",
    "bookmarks-default-favicon-source-duckduckgo-button": "duckduckgo"
  };
  if (selectedDefaultFaviconSourceEl) {
    draft.bookmarks.defaultFaviconSource =
      bookmarksDefaultFaviconSourcePairs[selectedDefaultFaviconSourceEl.id];
  }

  saveBookmarkNodeBookmarkSettingsToDraft(draft);
  saveDefaultBlockyBookmarkSettingsToDraft(draft);
};

export const saveDefaultBlockyBookmarkSettingsToDraft = (draft: Config) => {
  draft.bookmarks.defaultBlockyCols = Math.max(
    1,
    Number.parseInt(bookmarksDefaultBlockyColsInputEl.value, 10) || 1
  );
  draft.bookmarks.defaultBlockyColor = bookmarksDefaultBlockyColorInputEl.value;
};
