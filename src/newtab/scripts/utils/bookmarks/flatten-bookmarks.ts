import { BookmarkNode, BookmarkNodeBookmark } from "src/utils/config";

export const flattenBookmarks = (nodes: BookmarkNode[]): BookmarkNodeBookmark[] => {
  return nodes.flatMap((node) => {
    if (node.type === "bookmark") {
      return [node];
    } else if (node.type === "folder" && node.contents) {
      return flattenBookmarks(node.contents);
    }
    return [];
  });
};
