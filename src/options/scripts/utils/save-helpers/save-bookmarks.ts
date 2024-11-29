import {
  UserDefinedBookmark,
  Config,
  BookmarksType,
  BookmarksLocationFirefox,
  DefaultBlockyColorType,
  DefaultFaviconSource,
  UserDefinedBookmarkNode,
  UserDefinedBookmarkFolder
} from "src/newtab/scripts/config";
import {
  bookmarksDefaultBlockyColorInputEl,
  bookmarksDefaultBlockyColsInputEl,
  bookmarksShowBookmarkNamesCheckboxEl,
  bookmarksUserDefinedColsInputEl,
  bookmarksUserDefinedKeysCheckboxEl,
  bookmarksUserDefinedList
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

  saveUserDefinedBookmarkSettingsToDraft(draft);
};

export const saveUserDefinedBookmarkSettingsToDraft = (draft: Config) => {
  console.log("RUNRUNRUN");

  draft.bookmarks.userDefinedCols = parseInt(bookmarksUserDefinedColsInputEl.value);

  const bookmarksNodesToSave: UserDefinedBookmarkNode[] = [];

  const bookmarkTopLevelNodeEls = Array.from(bookmarksUserDefinedList.children);

  bookmarkTopLevelNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;
    const bookmarkNodeType = el.getAttribute("node-type");

    if (bookmarkNodeType === "bookmark") {
      bookmarksNodesToSave.push(getUserDefinedBookmarkData(uuid));
    } else if (bookmarkNodeType === "folder") {
      bookmarksNodesToSave.push(getUserDefinedBookmarkFolderData(uuid));
    }
  });

  console.log(bookmarksNodesToSave);

  draft.bookmarks.userDefined = bookmarksNodesToSave;
};

// prettier-ignore
export const getUserDefinedBookmarkData = (uuid: string) => {
  const nameInputEl = document.getElementById(`bookmark-${uuid}-name-input`) as HTMLInputElement;
  const urlInputEl = document.getElementById(`bookmark-${uuid}-url-input`) as HTMLInputElement;
  const colorInputEl = document.getElementById(`bookmark-${uuid}-color-input`) as HTMLInputElement;
  const iconTypeInputEl = document.getElementById(`bookmark-${uuid}-icon-type-input`) as HTMLInputElement;
  const iconColorInputEl = document.getElementById(`bookmark-${uuid}-icon-color-input`) as HTMLInputElement;

  return {
    type: "bookmark",
    name: nameInputEl.value,
    url: urlInputEl.value,
    color: colorInputEl.value,
    iconType: iconTypeInputEl.value,
    iconColor: iconColorInputEl.value
  } satisfies UserDefinedBookmark;
};

export const getUserDefinedBookmarkFolderData = (uuid: string) => {
  const nameInputEl = document.getElementById(`bookmark-${uuid}-name-input`) as HTMLInputElement;
  const colorInputEl = document.getElementById(`bookmark-${uuid}-color-input`) as HTMLInputElement;
  // prettier-ignore
  const folderContentsEl = document.getElementById(`bookmark-${uuid}-contents-container`) as HTMLDivElement;
  const folderContents: UserDefinedBookmarkNode[] = [];

  if (folderContentsEl) {
    const children = Array.from(folderContentsEl.children);

    children.forEach((childEl) => {
      const childUuid = childEl.getAttribute("bookmark-node-uuid") as string;
      const childType = childEl.getAttribute("node-type");

      if (childType === "bookmark") {
        folderContents.push(getUserDefinedBookmarkData(childUuid));
      } else if (childType === "folder") {
        folderContents.push(getUserDefinedBookmarkFolderData(childUuid));
      }
    });
  }

  return {
    type: "folder",
    name: nameInputEl.value,
    color: colorInputEl.value,
    contents: folderContents
  } satisfies UserDefinedBookmarkFolder;
};

export const saveDefaultBlockyBookmarkSettingsToDraft = (draft: Config) => {
  draft.bookmarks.defaultBlockyCols = parseInt(bookmarksDefaultBlockyColsInputEl.value);
  draft.message.textColor = bookmarksDefaultBlockyColorInputEl.value;
};
