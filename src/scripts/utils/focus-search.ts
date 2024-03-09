import { config } from "src/scripts/config";
import { searchContainerEl, searchInputEl } from "src/scripts/ui";

export const focusSearch = (e: KeyboardEvent) => {
  if (searchInputEl.matches(":focus")) return;

  searchContainerEl.classList.replace("border-transparent", config.focusedBorderClass);
  e.preventDefault();

  searchInputEl.focus();
};
