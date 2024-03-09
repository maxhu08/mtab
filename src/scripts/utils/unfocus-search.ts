import { searchInputEl, searchContainerEl } from "src/scripts/ui";

export const unfocusSearch = () => {
  searchInputEl.blur();

  searchContainerEl.classList.replace("border-teal-500", "border-transparent");
};
