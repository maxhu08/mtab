import { searchInputEl } from "src/newtab/scripts/ui";

export const setSearchValue = (value: string, emit: boolean = true) => {
  searchInputEl.value = value;

  if (emit) {
    searchInputEl.dispatchEvent(new Event("input", { bubbles: true }));
  }
};
