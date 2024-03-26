import { Bookmark, Config } from "src/newtab/scripts/config";
import { bookmarksOptionsContainerEl } from "src/options/scripts/ui";

export const saveBookmarksSettingsToDraft = (draft: Config) => {
  const totalBookmarks = bookmarksOptionsContainerEl.children.length;

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
