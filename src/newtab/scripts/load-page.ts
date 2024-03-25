// config
import { getConfig } from "./config";

// utils
import { setMessage } from "./utils/set-message";
import { setTitle } from "./utils/set-title";

// Key Events
import { listenToKeys } from "./keys";
import { renderBookmarks } from "./utils/render-bookmarks";
import { addAnimations } from "./utils/animations";
import { loadWallpaper } from "src/newtab/scripts/utils/load-wallpaper";
import { styleSearch } from "src/newtab/scripts/utils/style-search";
import { setMessageFont } from "src/newtab/scripts/utils/set-message-font";
import { setSearchStuff } from "src/newtab/scripts/utils/set-search-font";
import { setUISyle } from "src/newtab/scripts/utils/set-ui-style";

export const loadPage = () => {
  getConfig(({ config }) => {
    setTitle(config.title.defaultTitle);
    setUISyle(config.ui);

    loadWallpaper(config);

    setSearchStuff(config.search.font, config.search.placeholderText);
    styleSearch(config.ui.style, config.ui.foregroundColor);

    setMessageFont(config.message.font);
    setMessage(config.message.type, config.message.customText, config.user.name);

    renderBookmarks(config);

    addAnimations(config.animations);

    listenToKeys(config);
  });
};
