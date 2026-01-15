import { setBookmarkNodes } from "src/options/scripts/utils/bookmarks/set-bookmarks";
import { Config } from "src/utils/config";

export const fillBookmarkNodeBookmarks = (config: Config) => {
  setBookmarkNodes(config.bookmarks.userDefined);
};
