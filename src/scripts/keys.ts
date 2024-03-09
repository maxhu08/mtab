// ui
import { searchInputEl } from "src/scripts/ui";

// utils
import { focusSearch } from "src/scripts/utils/focus-search";
import { unfocusSearch } from "src/scripts/utils/unfocus-search";

export const listenToKeys = () => {
  document.addEventListener("keydown", (e) => {
    if (e.key === " ") focusSearch(e);
    if (e.key === "Escape") unfocusSearch();
  });

  searchInputEl.addEventListener("blur", () => {
    unfocusSearch();
  });

  searchInputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      window.location.href = `https://duckduckgo.com/?q=${searchInputEl.value}`;
    }
  });
};
