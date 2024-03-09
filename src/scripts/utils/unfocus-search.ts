import { config } from "src/scripts/config";
import { searchInputEl, searchContainerEl } from "src/scripts/ui";

export const unfocusSearch = () => {
  searchInputEl.blur();

  searchContainerEl.classList.replace(config.focusedBorderClass, "border-transparent");
};
