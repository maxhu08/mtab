import { bookmarksUserDefinedList } from "src/options/scripts/ui";
import {
  addBookmarkNodeBookmark,
  addBookmarkNodeFolder
} from "src/options/scripts/utils/bookmarks/handle-bookmark-ui";
import { BookmarkNode } from "src/utils/config";

export const importBookmarkNode = () => {
  const dataToImport = prompt("input your bookmark or folder");

  if (dataToImport === null) {
    toast.error("could not import your bookmark or folder");
    return;
  }

  const trimmed = dataToImport.trim();
  if (trimmed === "") {
    toast.info("input was empty, nothing imported");
    return;
  }

  // supported headers
  // MTAB_USER_DEFINED_BOOKMARK_FORMAT_v{version}_{json}
  // MTAB_USER_DEFINED_FOLDER_FORMAT_v{version}_{json}
  const headerMatch = trimmed.match(
    /^(MTAB_USER_DEFINED_(?:BOOKMARK(?:_FORMAT)?|FOLDER(?:_FORMAT)?)_v[^_]+)_(.+)$/
  );

  if (!headerMatch) {
    toast.error(
      "incorrect format, expected MTAB_USER_DEFINED_BOOKMARK_FORMAT_v#.#.#_ or MTAB_USER_DEFINED_FOLDER_FORMAT_v#.#.#_"
    );
    return;
  }

  const rawPayload = headerMatch[2].trim();

  let bookmarkNode: BookmarkNode | null;

  try {
    bookmarkNode = JSON.parse(rawPayload);
  } catch {
    toast.error("invalid bookmark data");
    return;
  }

  if (bookmarkNode?.type === "bookmark") {
    addBookmarkNodeBookmark(bookmarkNode, bookmarksUserDefinedList);
  } else if (bookmarkNode?.type === "folder") {
    addBookmarkNodeFolder(
      {
        ...bookmarkNode,
        iconType: bookmarkNode.iconType
      },
      bookmarksUserDefinedList
    );
  } else {
    toast.error("invalid bookmark data");
  }
};
