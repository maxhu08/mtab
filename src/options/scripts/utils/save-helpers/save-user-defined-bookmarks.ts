import { Config, BookmarkNodeBookmark, BookmarkNodeFolder, BookmarkNode } from "src/utils/config";
import { bookmarksUserDefinedColsInputEl, bookmarksUserDefinedList } from "src/options/scripts/ui";

export const saveBookmarkNodeBookmarkSettingsToDraft = (draft: Config) => {
  draft.bookmarks.userDefinedCols = parseInt(bookmarksUserDefinedColsInputEl.value);

  const bookmarksNodesToSave: BookmarkNode[] = [];

  const bookmarkTopLevelNodeEls = Array.from(bookmarksUserDefinedList.children);

  bookmarkTopLevelNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;
    const bookmarkNodeType = el.getAttribute("node-type");

    if (bookmarkNodeType === "bookmark") {
      bookmarksNodesToSave.push(getBookmarkNodeBookmarkData(uuid));
    } else if (bookmarkNodeType === "folder") {
      bookmarksNodesToSave.push(getBookmarkNodeFolderData(uuid));
    }
  });

  draft.bookmarks.userDefined = bookmarksNodesToSave;
};

// prettier-ignore
const getBookmarkNodeBookmarkData = (uuid: string) => {
  const nameInputEl = document.getElementById(`bookmark-${uuid}-name-input`) as HTMLInputElement;
  const urlInputEl = document.getElementById(`bookmark-${uuid}-url-input`) as HTMLInputElement;
  const colorInputEl = document.getElementById(`bookmark-${uuid}-color-input`) as HTMLInputElement;
  const iconTypeInputEl = document.getElementById(`bookmark-${uuid}-icon-type-input`) as HTMLInputElement;
  const iconColorInputEl = document.getElementById(`bookmark-${uuid}-icon-color-input`) as HTMLInputElement;
  const fillInputEl = document.getElementById(`bookmark-${uuid}-fill-input`) as HTMLInputElement;

  return {
    type: "bookmark",
    name: nameInputEl.value,
    url: urlInputEl.value,
    color: colorInputEl.value,
    iconType: iconTypeInputEl.value,
    iconColor: iconColorInputEl.value,
    fill: fillInputEl.value
  } satisfies BookmarkNodeBookmark;
};

const getBookmarkNodeFolderData = (uuid: string) => {
  const nameInputEl = document.getElementById(`bookmark-${uuid}-name-input`) as HTMLInputElement;
  const colorInputEl = document.getElementById(`bookmark-${uuid}-color-input`) as HTMLInputElement;
  // prettier-ignore
  const iconColorInputEl = document.getElementById(`bookmark-${uuid}-icon-color-input`) as HTMLInputElement;
  // prettier-ignore
  const folderContentsEl = document.getElementById(`bookmark-${uuid}-contents-container`) as HTMLDivElement;
  const folderContents: BookmarkNode[] = [];

  if (folderContentsEl) {
    const children = Array.from(folderContentsEl.children);

    children.forEach((childEl) => {
      const childUuid = childEl.getAttribute("bookmark-node-uuid") as string;
      const childType = childEl.getAttribute("node-type");

      if (childType === "bookmark") {
        folderContents.push(getBookmarkNodeBookmarkData(childUuid));
      } else if (childType === "folder") {
        folderContents.push(getBookmarkNodeFolderData(childUuid));
      }
    });
  }

  return {
    type: "folder",
    name: nameInputEl.value,
    color: colorInputEl.value,
    iconColor: iconColorInputEl.value,
    contents: folderContents
  } satisfies BookmarkNodeFolder;
};
