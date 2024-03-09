// ui
import { config } from "src/scripts/config";
import { searchInputEl } from "src/scripts/ui";

// utils
import { focusSearch, search, tryFocusSearch, unfocusSearch } from "src/scripts/utils/search";

export const listenToKeys = () => {
  document.addEventListener("keydown", (e) => {
    if (e.key === config.search.activationKey) tryFocusSearch(e);
    if (e.key === "Escape") unfocusSearch();

    if (e.key === config.closePageKey) window.close();
  });

  searchInputEl.addEventListener("blur", () => unfocusSearch());

  searchInputEl.addEventListener("focus", (e) => focusSearch(e));

  searchInputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search(searchInputEl.value);
    }
  });
};
