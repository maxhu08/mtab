// ui
import { Config } from "src/newtab/scripts/config";
import { searchInputEl } from "./ui";

// utils
import { focusSearch, search, tryFocusSearch, unfocusSearch } from "./utils/search";
// import { navigateTab } from "src/newtab/scripts/utils/navigate-tab";

export const listenToKeys = (config: Config) => {
  document.addEventListener("keydown", (e) => {
    if (!config.hotkeys.enabled) return;

    // keybinds stuff

    // search
    if (e.key === "Escape") unfocusSearch();
    const searchFocused = document.activeElement === searchInputEl;
    if (e.key === config.hotkeys.activationKey) tryFocusSearch(config, e);
    if (e.key === config.hotkeys.closePageKey && !searchFocused) window.close();

    // nav stuff
    // if (e.key === "J") navigateTab("left");
    // if (e.key === "K") navigateTab("right");
  });

  searchInputEl.addEventListener("blur", () => unfocusSearch());

  searchInputEl.addEventListener("focus", (e) => focusSearch(config, e));

  searchInputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // open in new tab if ctrl
      if (e.ctrlKey) {
        search(config, searchInputEl.value, true);
        return;
      }

      search(config, searchInputEl.value);
    }
  });

  searchInputEl.addEventListener("input", () => {
    if (!config.title.dynamic.enabled) return;

    // not empty or just spaces
    if (searchInputEl.value !== "" && !/^\s*$/.test(searchInputEl.value))
      document.title = searchInputEl.value;
    else document.title = config.title.defaultTitle;
  });
};
