import { searchInputEl } from "~/src/newtab/scripts/ui";
import { updateSearchHighlighting } from "~/src/newtab/scripts/utils/search/handle-search-highlighting";

export const setSearchValue = (value: string, emit: boolean = true) => {
  searchInputEl.value = value;

  updateSearchHighlighting();

  if (emit) {
    searchInputEl.dispatchEvent(new Event("input", { bubbles: true }));
  }
};
