import {
  bookmarksUserDefinedList,
  toggleCollapseAllBookmarkNodesButtonEl
} from "src/options/scripts/ui";
import {
  addBookmarkNodeBookmark,
  addBookmarkNodeFolder
} from "src/options/scripts/utils/bookmarks/handle-bookmark-ui";
import { BookmarkNode } from "src/utils/config";

export const setBookmarkNodes = (bookmarkNodes: BookmarkNode[]) => {
  bookmarksUserDefinedList.innerHTML = "";

  bookmarkNodes.forEach((bookmarkNode) => {
    if (bookmarkNode.type === "bookmark") {
      addBookmarkNodeBookmark(bookmarkNode, bookmarksUserDefinedList);
    } else if (bookmarkNode.type === "folder") {
      addBookmarkNodeFolder({ ...bookmarkNode }, bookmarksUserDefinedList, false);
    }
  });

  toggleCollapseAllBookmarkNodesButtonEl.click();
};
