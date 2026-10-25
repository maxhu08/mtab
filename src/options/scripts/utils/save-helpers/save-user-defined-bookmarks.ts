import { Config, BookmarkNode } from "~/src/utils/config";
import {
  bookmarksUserDefinedColsInputEl,
  bookmarksUserDefinedList
} from "~/src/options/scripts/ui";
import {
  getBookmarkNodeBookmarkData,
  getBookmarkNodeFolderData
} from "~/src/options/scripts/utils/bookmarks/get-bookmark-node-data";

export const saveBookmarkNodeBookmarkSettingsToDraft = (draft: Config) => {
  const cols = Number.parseInt(bookmarksUserDefinedColsInputEl.value, 10);
  draft.bookmarks.userDefinedCols = Number.isFinite(cols)
    ? Math.max(1, cols)
    : draft.bookmarks.userDefinedCols;

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