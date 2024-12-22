import {
  Config,
  BookmarksType,
  BookmarksLocationFirefox,
  DefaultBlockyColorType,
  DefaultFaviconSource
} from "src/utils/config";
import {
  bookmarksDefaultBlockyColorInputEl,
  bookmarksDefaultBlockyColsInputEl,
  bookmarksNumberKeysCheckboxEl,
  bookmarksShowBookmarkNamesCheckboxEl
} from "src/options/scripts/ui";
import { saveBookmarkNodeBookmarkSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-user-defined-bookmarks";

export const saveBookmarksSettingsToDraft = (draft: Config) => {
  draft.bookmarks.showBookmarkNames = bookmarksShowBookmarkNamesCheckboxEl.checked;

  draft.bookmarks.defaultBlockyCols = parseInt(bookmarksDefaultBlockyColsInputEl.value);
  draft.bookmarks.defaultBlockyColor = bookmarksDefaultBlockyColorInputEl.value;

  draft.bookmarks.numberKeys = bookmarksNumberKeysCheckboxEl.checked;

  const selectedTypeEl = document.querySelector(
    `button[btn-option-type="bookmarks-type"][selected="yes"]`
  ) as HTMLButtonElement;

  const bookmarksTypePairs: Record<string, BookmarksType> = {
    "bookmarks-type-user-defined-button": "user-defined",
    "bookmarks-type-default-button": "default",
    "bookmarks-type-default-blocky-button": "default-blocky",
    "bookmarks-type-none-button": "none"
  };

  draft.bookmarks.type = bookmarksTypePairs[selectedTypeEl.id];

  const selectedDefaultBlockyColorType = document.querySelector(
    `button[btn-option-type="bookmarks-default-blocky-color-type"][selected="yes"]`
  ) as HTMLButtonElement;

  const bookmarksDefaultBlockyColorTypePairs: Record<string, DefaultBlockyColorType> = {
    "bookmarks-default-blocky-color-type-random-button": "random",
    "bookmarks-default-blocky-color-type-custom-button": "custom"
  };

  // prettier-ignore
  draft.bookmarks.defaultBlockyColorType = bookmarksDefaultBlockyColorTypePairs[selectedDefaultBlockyColorType.id];

  const selectedLocationFirefoxEl = document.querySelector(
    `button[btn-option-type="bookmarks-location-firefox"][selected="yes"]`
  ) as HTMLButtonElement;

  const bookmarksLocationFirefoxPairs: Record<string, BookmarksLocationFirefox> = {
    "bookmarks-location-firefox-menu-button": "menu",
    "bookmarks-location-firefox-toolbar-button": "toolbar",
    "bookmarks-location-firefox-other-button": "other"
  };

  const selectedDefaultFaviconSourceEl = document.querySelector(
    `button[btn-option-type="bookmarks-default-favicon-source"][selected="yes"]`
  ) as HTMLButtonElement;

  // prettier-ignore
  draft.bookmarks.bookmarksLocationFirefox = bookmarksLocationFirefoxPairs[selectedLocationFirefoxEl.id];

  const bookmarksDefaultFaviconSourcePairs: Record<string, DefaultFaviconSource> = {
    "bookmarks-default-favicon-source-google-button": "google",
    "bookmarks-default-favicon-source-duckduckgo-button": "duckduckgo"
  };

  // prettier-ignore
  draft.bookmarks.defaultFaviconSource = bookmarksDefaultFaviconSourcePairs[selectedDefaultFaviconSourceEl.id];

  saveBookmarkNodeBookmarkSettingsToDraft(draft);
};

export const saveDefaultBlockyBookmarkSettingsToDraft = (draft: Config) => {
  draft.bookmarks.defaultBlockyCols = parseInt(bookmarksDefaultBlockyColsInputEl.value);
  draft.message.textColor = bookmarksDefaultBlockyColorInputEl.value;
};
