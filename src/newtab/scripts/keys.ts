// ui
import { Config } from "src/newtab/scripts/config";
import { searchInputEl } from "./ui";

// utils
import { focusSearch, search, tryFocusSearch, unfocusSearch } from "./utils/search";

export const listenToKeys = (config: Config) => {
  document.addEventListener("keydown", (e) => {
    if (e.key === config.hotkeys.activationKey) tryFocusSearch(config, e);
    if (e.key === "Escape") unfocusSearch();
    if (e.key === config.hotkeys.closePageKey) window.close();
  });

  searchInputEl.addEventListener("blur", () => unfocusSearch());

  searchInputEl.addEventListener("focus", (e) => focusSearch(config, e));

  searchInputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
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
