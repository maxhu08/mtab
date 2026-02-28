import { BookmarkNode } from "~/src/utils/config";
import { bookmarksUserDefinedList } from "~/src/options/scripts/ui";
import {
  getBookmarkNodeBookmarkData,
  getBookmarkNodeFolderData
} from "~/src/options/scripts/utils/bookmarks/get-bookmark-node-data";
import { countNodes } from "~/src/options/scripts/utils/bookmarks/count";

export const exportAllBookmarkNodes = async () => {
  const extensionVersion = chrome.runtime.getManifest().version;
  const prefix = `MTAB_USER_USER_DEFINED_BOOKMARKS_FORMAT_v${extensionVersion}_`;

  const bookmarkNodesToExport: BookmarkNode[] = [];

  const bookmarkTopLevelNodeEls = Array.from(bookmarksUserDefinedList.children);

  bookmarkTopLevelNodeEls.forEach((el) => {
    const uuid = el.getAttribute("bookmark-node-uuid") as string;
    const bookmarkNodeType = el.getAttribute("node-type");

    if (bookmarkNodeType === "bookmark") {
      bookmarkNodesToExport.push(getBookmarkNodeBookmarkData(uuid));
    } else if (bookmarkNodeType === "folder") {
      bookmarkNodesToExport.push(getBookmarkNodeFolderData(uuid));
    }
  });

  const formattedExport = `${prefix}${JSON.stringify(bookmarkNodesToExport)}`;

  await navigator.clipboard.writeText(formattedExport);

  const counts = countNodes(bookmarkNodesToExport);
  toast.success(`${counts[0]} bookmarks and ${counts[1]} folders copied to clipboard`);
};
