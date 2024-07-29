// config
import { getConfig } from "./config";

// utils
import { setTitle } from "./utils/set-title";
import { setUISyle } from "src/newtab/scripts/utils/set-ui-style";
import { loadWallpaper } from "src/newtab/scripts/utils/load-wallpaper";
import { setSearchStuff } from "src/newtab/scripts/utils/set-search-stuff";
import { styleSearch } from "src/newtab/scripts/utils/style-search";
import { styleMessage } from "src/newtab/scripts/utils/style-message";
import { setMessage } from "./utils/set-message";
import { renderBookmarks } from "./utils/render-bookmarks";
import { addAnimations } from "./utils/animations";
import { listenToKeys } from "./keys";
import { loadFavicon } from "src/newtab/scripts/utils/load-favicon";

export const loadPage = () => {
  const manifest = chrome.runtime.getManifest();

  document.documentElement.setAttribute("extension-id", chrome.runtime.id);
  document.documentElement.setAttribute("extension-version", manifest.version);
  // @ts-expect-error
  document.documentElement.setAttribute("made-by", manifest.author);

  getConfig(({ config }) => {
    setTitle(config.title.defaultTitle);
    loadFavicon(config);

    setUISyle(config.ui);

    loadWallpaper(config);

    setSearchStuff(
      config.search.font,
      config.search.placeholderText,
      config.search.bookmarkPlaceholderText
    );
    styleSearch(
      config.search.enabled,
      config.ui.style,
      config.search.textColor,
      config.search.placeholderTextColor,
      config.ui.foregroundColor,
      config.search.searchIconColor,
      config.search.bookmarkIconColor,
      config.search.selectIconColor
    );

    styleMessage(config.message.textColor, config.message.font);
    setMessage(
      config.message.enabled,
      config.message.type,
      config.message.customText,
      config.user.name
    );

    renderBookmarks(config);

    addAnimations(config.animations);

    listenToKeys(config);
  });
};
