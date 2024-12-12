// config
import { getConfig } from "./config";

// utils
import { setTitle } from "./utils/set-title";
import { setUISyle } from "src/newtab/scripts/utils/set-ui-style";
import { loadWallpaper } from "src/newtab/scripts/utils/load-wallpaper";
import { styleSearch } from "src/newtab/scripts/utils/style-search";
import { styleMessage } from "src/newtab/scripts/utils/style-message";
import { setMessage } from "src/newtab/scripts/utils/messages/set-message";
import { renderBookmarks } from "./utils/bookmarks/render-bookmarks";
import { addAnimations } from "./utils/animations";
import { listenToKeys } from "./keys";
import { loadFavicon } from "src/newtab/scripts/utils/load-favicon";
import { fixDisappearingUI } from "src/newtab/scripts/utils/fix-disappearing-ui";
import { listenToSearch } from "src/newtab/scripts/utils/listen-search";
import { showOptionsButton } from "src/newtab/scripts/utils/show-options-button";
import { listenBookmarkNumberKeys } from "src/newtab/scripts/utils/bookmarks/listen-bookmark-number-keys";

export const loadPage = () => {
  const manifest = chrome.runtime.getManifest();

  document.documentElement.setAttribute("extension-id", chrome.runtime.id);
  document.documentElement.setAttribute("extension-version", manifest.version);
  // @ts-expect-error
  document.documentElement.setAttribute("made-by", manifest.author);

  getConfig(({ config }) => {
    setTitle(config.title.defaultTitle);
    loadFavicon(config.title.faviconType);

    setUISyle(config.ui);

    loadWallpaper(config.wallpaper);

    styleSearch(
      config.ui.style,
      config.ui.foregroundColor,
      config.search.enabled,
      config.search.textColor,
      config.search.placeholderTextColor,
      config.search.searchIconColor,
      config.search.bookmarkIconColor,
      config.search.selectIconColor,
      config.search.placeholderText,
      config.search.bookmarkPlaceholderText,
      config.search.font.type,
      config.search.font.custom
    );

    styleMessage(config.message.textColor, config.message.font.type, config.message.font.custom);
    setMessage(
      config.message.enabled,
      config.message.type,
      config.message.customText,
      config.user.name
    );

    renderBookmarks(config);
    listenBookmarkNumberKeys(config.bookmarks.numberKeys, config.bookmarks.type);
    showOptionsButton(
      config.options.showOptionsButton,
      config.ui.style,
      config.animations.enabled,
      config.animations.initialType,
      config.message.textColor
    );
    fixDisappearingUI();

    addAnimations(config.animations);

    listenToKeys(config);
    listenToSearch(config);
  });
};
