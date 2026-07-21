import { countNodes } from "~/src/options/scripts/utils/bookmarks/count";
import { setBookmarkNodes } from "~/src/options/scripts/utils/bookmarks/set-bookmarks";
import { showInputDialog } from "~/src/options/scripts/utils/input-dialog";
import { BookmarkNode } from "~/src/utils/config";
import { t } from "~/src/options/scripts/i18n";

export const importAllBookmarkNodes = async () => {
  const dataToImport = await showInputDialog(
    t(
      "input your bookmarks and folders to import (THIS WILL OVERWRITE YOUR CURRENT BOOKMARKS AND FOLDERS)"
    )
  );

  if (dataToImport === null) {
    return;
  }

  const trimmed = dataToImport.trim();

  if (trimmed === "") {
    toast.info(t("input was empty, nothing imported"));
    return;
  }

  // supported header
  // MTAB_USER_USER_DEFINED_BOOKMARKS_FORMAT_v{version}_{json}
  const headerMatch = trimmed.match(/^(MTAB_USER_USER_DEFINED_BOOKMARKS_FORMAT_v[^_]+)_(.+)$/);

  if (!headerMatch) {
    toast.error(t("incorrect format, expected MTAB_USER_USER_DEFINED_BOOKMARKS_FORMAT_v#.#.#_"));
    return;
  }

  const rawPayload = headerMatch[2].trim();

  let bookmarksNodesToImport: BookmarkNode[];

  try {
    bookmarksNodesToImport = JSON.parse(rawPayload);
  } catch {
    toast.error(t("invalid bookmark data"));
    return;
  }

  setBookmarkNodes(bookmarksNodesToImport);

  const counts = countNodes(bookmarksNodesToImport);
  toast.success(
    t("imported {bookmarks} bookmarks and {folders} folders", {
      bookmarks: counts[0],
      folders: counts[1]
    })
  );
};