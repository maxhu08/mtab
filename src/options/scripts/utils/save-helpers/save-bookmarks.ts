import {
  UserDefinedBookmark,
  Config,
  BookmarksType,
  BookmarksLocationFirefox
} from "src/newtab/scripts/config";
import {
  bookmarksDefaultBlockyColorInputEl,
  bookmarksDefaultBlockyColsInputEl,
  bookmarksShowBookmarkNamesCheckboxEl,
  bookmarksUserDefinedColsInputEl,
  bookmarksUserDefinedKeysCheckboxEl
} from "src/options/scripts/ui";

export const saveBookmarksSettingsToDraft = (draft: Config) => {
  draft.bookmarks.showBookmarkNames = bookmarksShowBookmarkNamesCheckboxEl.checked;

  draft.bookmarks.defaultBlockyCols = parseInt(bookmarksDefaultBlockyColsInputEl.value);
  draft.bookmarks.defaultBlockyColor = bookmarksDefaultBlockyColorInputEl.value;

  draft.bookmarks.userDefinedKeys = bookmarksUserDefinedKeysCheckboxEl.checked;

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

  const selectedLocationFirefoxEl = document.querySelector(
    `button[btn-option-type="bookmarks-location-firefox"][selected="yes"]`
  ) as HTMLButtonElement;

  const bookmarksLocationFirefoxPairs: Record<string, BookmarksLocationFirefox> = {
    "bookmarks-location-firefox-menu-button": "menu",
    "bookmarks-location-firefox-toolbar-button": "toolbar",
    "bookmarks-location-firefox-other-button": "other"
  };

  // prettier-ignore
  draft.bookmarks.bookmarksLocationFirefox = bookmarksLocationFirefoxPairs[selectedLocationFirefoxEl.id];

  saveUserDefinedBookmarkSettingsToDraft(draft);
};

export const saveUserDefinedBookmarkSettingsToDraft = (draft: Config) => {
  draft.bookmarks.userDefinedCols = parseInt(bookmarksUserDefinedColsInputEl.value);

  // user defined list stuff
  const totalBookmarks = (document.getElementById("bookmarks-user-defined-list") as HTMLDivElement)
    .children.length;

  const bookmarksArrToSave: UserDefinedBookmark[] = [];

  for (let i = 0; i < totalBookmarks; i++) {
    const nameInputEl = document.getElementById(`bookmark-${i}-name-input`) as HTMLInputElement;
    const urlInputEl = document.getElementById(`bookmark-${i}-url-input`) as HTMLInputElement;
    const colorInputEl = document.getElementById(`bookmark-${i}-color-input`) as HTMLInputElement;
    // prettier-ignore
    const iconTypeInputEl = document.getElementById(`bookmark-${i}-icon-type-input`) as HTMLInputElement;
    // prettier-ignore
    const iconColorInputEl = document.getElementById(`bookmark-${i}-icon-color-input`) as HTMLInputElement;

    const bookmarkObjToSave: UserDefinedBookmark = {
      name: nameInputEl.value,
      url: urlInputEl.value,
      color: colorInputEl.value,
      iconType: iconTypeInputEl.value,
      iconColor: iconColorInputEl.value
    };

    bookmarksArrToSave.push(bookmarkObjToSave);
  }

  draft.bookmarks.userDefined = bookmarksArrToSave;
};

export const saveDefaultBlockyBookmarkSettingsToDraft = (draft: Config) => {
  draft.bookmarks.defaultBlockyCols = parseInt(bookmarksDefaultBlockyColsInputEl.value);
  draft.message.textColor = bookmarksDefaultBlockyColorInputEl.value;
};
