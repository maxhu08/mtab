import { BookmarkNode, BookmarkNodeBookmark, BookmarkNodeFolder } from "src/utils/config";

// prettier-ignore
export const getBookmarkNodeBookmarkData = (uuid: string) => {
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

// prettier-ignore
export const getBookmarkNodeFolderData = (uuid: string) => {
  const nameInputEl = document.getElementById(`bookmark-${uuid}-name-input`) as HTMLInputElement;
  const colorInputEl = document.getElementById(`bookmark-${uuid}-color-input`) as HTMLInputElement;
  const iconTypeInputEl = document.getElementById(`bookmark-${uuid}-icon-type-input`) as HTMLInputElement;
  const iconColorInputEl = document.getElementById(`bookmark-${uuid}-icon-color-input`) as HTMLInputElement;
  const fillInputEl = document.getElementById(`bookmark-${uuid}-fill-input`) as HTMLInputElement;
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
    iconType: iconTypeInputEl.value,
    iconColor: iconColorInputEl.value,
    fill: fillInputEl.value,
    contents: folderContents
  } satisfies BookmarkNodeFolder;
};
