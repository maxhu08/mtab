import { BookmarkNode } from "src/utils/config";

export const countNodes = (nodes: BookmarkNode[]) => {
  let bookmarks = 0;
  let folders = 0;

  const walk = (node: BookmarkNode) => {
    if (node.type === "bookmark") {
      bookmarks++;
    } else if (node.type === "folder") {
      folders++;
      node.contents?.forEach(walk);
    }
  };

  nodes.forEach(walk);

  return [bookmarks, folders];
};
