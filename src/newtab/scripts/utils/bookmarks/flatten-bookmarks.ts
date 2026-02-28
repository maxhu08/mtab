import { BookmarkNode, BookmarkNodeBookmark } from "~/src/utils/config";

export const flattenBookmarks = (nodes: BookmarkNode[]): BookmarkNodeBookmark[] => {
  const flattened = nodes.flatMap((node) => {
    if (node.type === "bookmark") {
      return [node];
    } else if (node.type === "folder" && node.contents) {
      return flattenBookmarks(node.contents);
    }
    return [];
  });

  const seenBookmarks = new Set<string>();

  return flattened.filter((bookmark) => {
    const key = `${bookmark.name}\u0000${bookmark.url}`;
    if (seenBookmarks.has(key)) return false;
    seenBookmarks.add(key);
    return true;
  });
};
