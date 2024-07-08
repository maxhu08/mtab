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
import { setSearchStuff } from "src/newtab/scripts/utils/set-search-font";
import { setUISyle } from "src/newtab/scripts/utils/set-ui-style";
import { styleMessage } from "src/newtab/scripts/utils/style-message";

export const loadPage = () => {
  const manifest = chrome.runtime.getManifest();

  document.documentElement.setAttribute("extension-id", chrome.runtime.id);
  document.documentElement.setAttribute("extension-version", manifest.version);
  // @ts-expect-error
  document.documentElement.setAttribute("made-by", manifest.author);

  getConfig(({ config }) => {
    setTitle(config.title.defaultTitle);
    setUISyle(config.ui);

    loadWallpaper(config);

    setSearchStuff(config.search.font, config.search.placeholderText);
    styleSearch(config.ui.style, config.search.textColor, config.ui.foregroundColor);

    styleMessage(config.message.textColor, config.message.font);
    setMessage(config.message.type, config.message.customText, config.user.name);

    renderBookmarks(config);

    addAnimations(config.animations);

    listenToKeys(config);
  });
};
