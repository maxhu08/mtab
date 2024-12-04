import {
  BookmarksLocationFirefox,
  DefaultBlockyColorType,
  BookmarkNodeFolder,
  BookmarkNode,
  DefaultFaviconSource
} from "src/newtab/scripts/config";
import { getFaviconURL } from "src/newtab/scripts/utils/favicon-url";
import { getUserAgent } from "src/utils/user-agent";

export const convertBrowserBookmarksToBookmarkNodes = async (
  bookmarksLocationFirefox: BookmarksLocationFirefox,
  defaultBlockyColorType: DefaultBlockyColorType,
  faviconSource: DefaultFaviconSource
): Promise<BookmarkNode[]> => {
  const userAgent = getUserAgent();

  const getBookmarkNodes = (node: chrome.bookmarks.BookmarkTreeNode): BookmarkNode[] => {
    if (node.url) {
      // bookmark
      return [
        {
          type: "bookmark",
          name: node.title,
          color: getColorFromString(node.title),
          iconColor: "#ffffff",
          iconType: `url-${getFaviconURL(node.url, faviconSource)}`,
          url: node.url
        }
      ];
    } else if (node.children) {
      // folder
      if (defaultBlockyColorType === "random") {
        const randomColor = getColorFromString(node.title);

        return [
          {
            type: "folder",
            name: node.title,
            color: randomColor,
            iconColor: randomColor,
            contents: node.children.flatMap(getBookmarkNodes)
          }
        ];
      } else {
        return [
          {
            type: "folder",
            name: node.title,
            color: "#ffffff",
            iconColor: "#ffffff",
            contents: node.children.flatMap(getBookmarkNodes)
          }
        ];
      }
    }
    return [];
  };

  const rootBookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
    chrome.bookmarks.getTree((bookmarkTree) => {
      if (userAgent === "firefox") {
        const root = bookmarkTree[0]; // root________
        if (!root || !root.children) {
          resolve([]);
          return;
        }

        let folderId: string = "";
        if (bookmarksLocationFirefox === "menu") folderId = "menu________";
        else if (bookmarksLocationFirefox === "toolbar") folderId = "toolbar_____";
        else if (bookmarksLocationFirefox === "other") folderId = "unfiled_____";

        const targetFolder = root.children.find((folder) => folder.id === folderId);
        resolve(targetFolder?.children ?? []);
      } else {
        // other browsers
        resolve(bookmarkTree);
      }
    });
  });

  const bookmarkNodes = rootBookmarks.flatMap(getBookmarkNodes);

  if (userAgent === "firefox") {
    return bookmarkNodes;
  } else {
    // use the folder with name "Bookmarks"
    const bookmarksFolder = (bookmarkNodes[0] as BookmarkNodeFolder).contents.find(
      (node) => node.type === "folder" && node.name === "Bookmarks"
    ) as BookmarkNodeFolder;

    if (bookmarksFolder) return bookmarksFolder.contents;
    else return [];
  }
};

export const getColorFromString = (val: string) => {
  const randomColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e"
  ];

  let hash = 0;
  for (let i = 0; i < val.length; i++) {
    hash = (hash << 5) - hash + val.charCodeAt(i);
    hash |= 0;
  }

  return randomColors[Math.abs(hash) % randomColors.length];
};
