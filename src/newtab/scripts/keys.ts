// ui
import { Config } from "src/newtab/scripts/config";
import { searchInputEl } from "./ui";

// utils
import { focusSearch, search, tryFocusSearch, unfocusSearch } from "./utils/search";

export const listenToKeys = (config: Config) => {
  document.addEventListener("keydown", (e) => {
    if (e.key === config.search.activationKey) tryFocusSearch(config, e);
    if (e.key === "Escape") unfocusSearch(config);
    if (e.key === config.closePageKey) window.close();
  });

  searchInputEl.addEventListener("blur", () => unfocusSearch(config));

  searchInputEl.addEventListener("focus", (e) => focusSearch(config, e));

  searchInputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search(config, searchInputEl.value);
    }
  });

  searchInputEl.addEventListener("input", () => {
    if (!config.dynamicTitle) return;

    if (searchInputEl.value !== "") document.title = searchInputEl.value;
    else document.title = config.title;
  });
};
