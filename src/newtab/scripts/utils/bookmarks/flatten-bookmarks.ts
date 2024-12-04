import { BookmarkNode } from "src/newtab/scripts/config";

export const flattenBookmarks = (nodes: BookmarkNode[]): BookmarkNode[] => {
  return nodes.flatMap((node) => {
    if (node.type === "bookmark") {
      return [node];
    } else if (node.type === "folder" && node.contents) {
      return flattenBookmarks(node.contents);
    }
    return [];
  });
};
