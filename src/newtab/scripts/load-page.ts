// config
import { getConfig } from "../../utils/config";

// utils
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
import { showOptionsButton } from "src/newtab/scripts/utils/show-options-button";
import { listenBookmarkNumberKeys } from "src/newtab/scripts/utils/bookmarks/listen-bookmark-number-keys";
import { hideCover } from "src/newtab/scripts/utils/hide-cover";
import { coverEl } from "src/newtab/scripts/ui";
import { handleSearchAssist } from "src/newtab/scripts/utils/search/handle-search-assist";
import { snowStorm } from "src/newtab/scripts/utils/extras/snow-effect";
import { initSW } from "src/newtab/scripts/sw";
import { titleTypewriterEffect } from "src/newtab/scripts/utils/title/title-effects";
import { initSearchHighlighting } from "src/newtab/scripts/utils/search/handle-search-highlighting";

export const loadPage = () => {
  const manifest = chrome.runtime.getManifest();

  document.documentElement.setAttribute("extension-id", chrome.runtime.id);
  document.documentElement.setAttribute("extension-version", manifest.version);
  // @ts-expect-error
  document.documentElement.setAttribute("made-by", manifest.author);

  getConfig(({ config }) => {
    initSW();

    document.title = config.title.defaultTitle;

    if (config.title.effect === "typewriter") {
      titleTypewriterEffect(config.title.defaultTitle, config.title.dynamic.enabled);
    }

    loadFavicon(config.title.faviconType);

    setUISyle(config.ui);

    if (!config.wallpaper.enabled) {
      coverEl.style.transitionDuration = "0ms";
      hideCover();
    } else loadWallpaper(config.wallpaper);

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

    styleMessage(
      config.message.textColor,
      config.message.textSize,
      config.message.font.type,
      config.message.font.custom
    );
    setMessage(
      config.message.enabled,
      config.message.type,
      config.message.customText,
      config.user.name,
      config.message.weather.unitsType
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
    handleSearchAssist(config);

    initSearchHighlighting(config.search.textColor, config.search.linkTextColor);

    // extras
    if (config.extras.snow.enabled !== "off") {
      if (config.extras.snow.enabled === "on") snowStorm();
      else if (config.extras.snow.enabled === "winter" && new Date().getMonth() === 11) snowStorm();
    }
  });
};
