import { Bookmark, Config } from "src/newtab/scripts/config";
import { bookmarksUserDefinedList } from "src/options/scripts/ui";

export const saveBookmarksSettingsToDraft = (draft: Config) => {
  const selectedEl = document.querySelector(
    `button[btn-option-type="bookmarks-type"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedEl.id) {
    case "bookmarks-type-default-button": {
      draft.bookmarks.type = "default";
      break;
    }
    case "bookmarks-type-user-defined-button": {
      draft.bookmarks.type = "user-defined";
      break;
    }
    case "bookmarks-type-none-button": {
      draft.bookmarks.type = "none";
      break;
    }
  }

  saveUserDefinedBookmarkSettingsToDraft(draft);
};

export const saveUserDefinedBookmarkSettingsToDraft = (draft: Config) => {
  const totalBookmarks = bookmarksUserDefinedList.children.length;

  const bookmarksArrToSave: Bookmark[] = [];

  for (let i = 0; i < totalBookmarks; i++) {
    const nameInputEl = document.getElementById(`bookmark-${i}-name-input`) as HTMLInputElement;
    const urlInputEl = document.getElementById(`bookmark-${i}-url-input`) as HTMLInputElement;
    // prettier-ignore
    const iconTypeInputEl = document.getElementById(`bookmark-${i}-icon-type-input`) as HTMLInputElement;
    const colorInputEl = document.getElementById(`bookmark-${i}-color-input`) as HTMLInputElement;

    const bookmarkObjToSave: Bookmark = {
      name: nameInputEl.value,
      url: urlInputEl.value,
      iconType: iconTypeInputEl.value,
      color: colorInputEl.value
    };

    bookmarksArrToSave.push(bookmarkObjToSave);
  }

  draft.bookmarks.userDefined = bookmarksArrToSave;
};
