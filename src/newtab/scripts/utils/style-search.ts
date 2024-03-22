import { UIStyle } from "src/newtab/scripts/config";
import { searchContainerEl, searchInputEl } from "src/newtab/scripts/ui";

export const styleSearch = (style: UIStyle, foregroundColor: string) => {
  if (style === "solid") {
    searchContainerEl.classList.add("bg-neutral-900");

    searchContainerEl.style.backgroundColor = foregroundColor;

    return;
  }
  if (style === "glass") {
    searchContainerEl.classList.add("glass-effect");
    searchInputEl.classList.replace("placeholder-neutral-500", "placeholder-neutral-400");
    return;
  }
};
