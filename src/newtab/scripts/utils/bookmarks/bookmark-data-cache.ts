import {
  BookmarkNode,
  BookmarkNodeBookmark,
  BookmarksLocationFirefox,
  DefaultBlockyColorType,
  DefaultFaviconSource
} from "src/utils/config";
import { convertBrowserBookmarksToBookmarkNodes } from "src/newtab/scripts/utils/bookmarks/convert-browser-bookmarks";
import { flattenBookmarks } from "src/newtab/scripts/utils/bookmarks/flatten-bookmarks";

type BrowserBookmarkCacheKey = {
  bookmarksLocationFirefox: BookmarksLocationFirefox;
  defaultBlockyColorType: DefaultBlockyColorType;
  defaultBlockyColor: string;
  defaultFaviconSource: DefaultFaviconSource;
};

let cachedNodesKey: string | null = null;
let cachedNodesPromise: Promise<BookmarkNode[]> | null = null;

let cachedFlattenedKey: string | null = null;
let cachedFlattenedPromise: Promise<BookmarkNodeBookmark[]> | null = null;

const toCacheKey = (key: BrowserBookmarkCacheKey) => JSON.stringify(key);

export const getBrowserBookmarkNodes = (key: BrowserBookmarkCacheKey): Promise<BookmarkNode[]> => {
  const cacheKey = toCacheKey(key);
  if (cachedNodesPromise && cachedNodesKey === cacheKey) {
    return cachedNodesPromise;
  }

  cachedNodesKey = cacheKey;
  cachedNodesPromise = convertBrowserBookmarksToBookmarkNodes(
    key.bookmarksLocationFirefox,
    key.defaultBlockyColorType,
    key.defaultBlockyColor,
    key.defaultFaviconSource
  );

  return cachedNodesPromise;
};

export const getBrowserFlattenedBookmarks = (
  key: BrowserBookmarkCacheKey
): Promise<BookmarkNodeBookmark[]> => {
  const cacheKey = toCacheKey(key);
  if (cachedFlattenedPromise && cachedFlattenedKey === cacheKey) {
    return cachedFlattenedPromise;
  }

  cachedFlattenedKey = cacheKey;
  cachedFlattenedPromise = getBrowserBookmarkNodes(key).then((bookmarkNodes) =>
    flattenBookmarks(bookmarkNodes)
  );

  return cachedFlattenedPromise;
};
