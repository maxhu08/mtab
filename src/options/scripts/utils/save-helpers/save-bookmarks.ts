import { UserDefinedBookmark, Config } from "src/newtab/scripts/config";

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
