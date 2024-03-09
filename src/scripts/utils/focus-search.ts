import { searchContainerEl, searchInputEl } from "src/scripts/ui";

export const focusSearch = (e: KeyboardEvent) => {
  if (searchInputEl.matches(":focus")) return;

  searchContainerEl.classList.replace("border-transparent", "border-teal-500");
  e.preventDefault();

  searchInputEl.focus();
};
