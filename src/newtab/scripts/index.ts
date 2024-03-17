// Config
import { getConfig } from "./config";

// Utils
import { setCustomMessage, setMorningAfternoonMessage, setTimeMessage } from "./utils/set-message";
import { setTitle } from "./utils/set-title";

// Key Events
import { listenToKeys } from "./keys";
import { renderBookmarks } from "./utils/render-bookmarks";
import { addAnimations } from "./utils/animations";
import { loadWallpaper } from "src/newtab/scripts/utils/load-wallpaper";
import { styleSearch } from "src/newtab/scripts/utils/style-search";
import { setSearchFont } from "src/newtab/scripts/utils/set-search-font";
import { setMessageFont } from "src/newtab/scripts/utils/set-message-font";

// ******************************************************************
// initial page load logic start
getConfig(({ config }) => {
  setTitle(config.title);

  loadWallpaper(config);

  setSearchFont(config.search.font);
  styleSearch(config.uiStyle);

  // setCustomMessage(`Hello, ${config.user.name}`);
  setMessageFont(config.message.font);
  setMorningAfternoonMessage(config.user.name);
  // setTimeMessage("12hr");

  renderBookmarks(config);

  addAnimations(config.animations);

  listenToKeys(config);
});
// initial page load logic end
// ******************************************************************
