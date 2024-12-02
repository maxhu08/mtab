import { Config } from "src/newtab/scripts/config";
import { renderDefaultBookmarks } from "src/newtab/scripts/utils/bookmarks/render-bookmarks-default";
import { renderDefaultBlockyBookmarks } from "src/newtab/scripts/utils/bookmarks/render-bookmarks-default-blocky";
import { renderUserDefinedBookmarks } from "src/newtab/scripts/utils/bookmarks/render-bookmarks-user-defined";

export const renderBookmarks = (config: Config) => {
  switch (config.bookmarks.type) {
    case "none": {
      return;
    }
    case "user-defined": {
      renderUserDefinedBookmarks(config);
      break;
    }
    case "default": {
      renderDefaultBookmarks(config);
      break;
    }
    case "default-blocky": {
      renderDefaultBlockyBookmarks(config);
      break;
    }
  }
};
