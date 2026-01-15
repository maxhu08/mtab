import {
  bookmarksUserDefinedList,
  toggleCollapseAllBookmarkNodesButtonEl
} from "src/options/scripts/ui";
import {
  addBookmarkNodeBookmark,
  addBookmarkNodeFolder,
  handleBookmarkSettings,
  refreshHandleTooltips
} from "src/options/scripts/utils/bookmarks/handle-bookmark-ui";
import { BookmarkNode } from "src/utils/config";

export const setBookmarkNodes = (bookmarkNodes: BookmarkNode[]) => {
  bookmarksUserDefinedList.innerHTML = "";
  bookmarkNodes.forEach((bookmarkNode) => {
    if (bookmarkNode.type === "bookmark")
      addBookmarkNodeBookmark(bookmarkNode, bookmarksUserDefinedList);
    else if (bookmarkNode.type === "folder")
      addBookmarkNodeFolder(
        {
          ...bookmarkNode,
          iconType: bookmarkNode.iconType
        },
        bookmarksUserDefinedList
      );
  });

  const bookmarkNodeEls = bookmarksUserDefinedList.querySelectorAll('[node-type="bookmark"]');
  bookmarkNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;
    handleBookmarkSettings(uuid);
  });

  toggleCollapseAllBookmarkNodesButtonEl.click();
  refreshHandleTooltips();
};
