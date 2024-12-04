import {
  BookmarksLocationFirefox,
  UserDefinedBookmarkFolder,
  UserDefinedBookmarkNode
} from "src/newtab/scripts/config";
import { getUserAgent } from "src/utils/user-agent";

export const convertBrowserBookmarksToBookmarkNodes = async (
  bookmarksLocationFirefox: BookmarksLocationFirefox
): Promise<UserDefinedBookmarkNode[]> => {
  const getBookmarkNodes = (node: chrome.bookmarks.BookmarkTreeNode): UserDefinedBookmarkNode[] => {
    if (node.url) {
      // bookmark
      return [
        {
          type: "bookmark",
          name: node.title,
          color: "#000000",
          iconColor: "#ffffff",
          iconType: "ri-instance-line",
          url: node.url
        }
      ];
    } else if (node.children) {
      // folder
      return [
        {
          type: "folder",
          name: node.title,
          color: "#000000",
          iconColor: "#ffffff",
          contents: node.children.flatMap(getBookmarkNodes)
        }
      ];
    }
    return [];
  };

  const rootBookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
    let location = "";

    if (bookmarksLocationFirefox === "menu") location = "menu________";
    else if (bookmarksLocationFirefox === "toolbar") location = "toolbar_____";
    else if (bookmarksLocationFirefox === "other") location = "unfiled_____";

    const userAgent = getUserAgent();
    if (userAgent === "firefox") {
      chrome.bookmarks.getTree((bookmarkTree) => {
        const rootFolder = bookmarkTree.find((cb) => cb.id === location);
        if (rootFolder && rootFolder.children) {
          resolve(rootFolder.children);
        } else {
          resolve([]);
        }
      });
    } else {
      chrome.bookmarks.getTree(resolve); // for other browsers
    }
  });

  return (rootBookmarks.flatMap(getBookmarkNodes)[0] as UserDefinedBookmarkFolder).contents;
};
