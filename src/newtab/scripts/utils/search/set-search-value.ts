import { searchInputEl } from "src/newtab/scripts/ui";

export const setSearchValue = (value: string) => {
  searchInputEl.value = value;
  searchInputEl.dispatchEvent(new Event("input", { bubbles: true }));
};
