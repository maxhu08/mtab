import { Config } from "src/newtab/scripts/config";
import { renderDefaultBookmarks } from "src/newtab/scripts/utils/render-bookmarks-default";
import { renderUserDefinedBookmarks } from "src/newtab/scripts/utils/render-bookmarks-user-defined";

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
  }
};
