import { UIStyle } from "src/newtab/scripts/config";
import { searchContainerEl, searchInputEl } from "src/newtab/scripts/ui";

export const styleSearch = (style: UIStyle) => {
  if (style === "solid") {
    searchContainerEl.classList.add("bg-neutral-900");
    return;
  }
  if (style === "glass") {
    searchContainerEl.classList.add("glass-effect");
    searchInputEl.classList.replace("placeholder-neutral-500", "placeholder-neutral-400");
    return;
  }
};
