import { Config } from "src/newtab/scripts/config";
import { bookmarkSearchContainerEl, bookmarkSearchInputEl } from "src/newtab/scripts/ui";

export const tryFocusBookmarkSearch = (config: Config, e: KeyboardEvent) => {
  // in case already focused
  if (bookmarkSearchInputEl.matches(":focus")) return;

  focusBookmarkSearch(config, e);
};

export const focusBookmarkSearch = (config: Config, e: Event) => {
  bookmarkSearchContainerEl.classList.remove("border-transparent");
  bookmarkSearchContainerEl.style.borderColor = config.search.focusedBorderColor;

  bookmarkSearchInputEl.focus();
  e.preventDefault();
};

export const unfocusBookmarkSearch = () => {
  bookmarkSearchInputEl.blur();

  bookmarkSearchContainerEl.style.borderColor = "#00000000";
  bookmarkSearchContainerEl.classList.add("border-transparent");
};
