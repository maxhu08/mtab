import { Config } from "src/newtab/scripts/config";
import {
  bookmarksContainerEl,
  bookmarkSearchContainerEl,
  bookmarkSearchInputEl,
  searchContainerEl
} from "src/newtab/scripts/ui";

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

export const unfocusBookmarkSearch = (animationType: string) => {
  bookmarkSearchInputEl.blur();

  bookmarkSearchContainerEl.style.borderColor = "#00000000";
  bookmarkSearchContainerEl.classList.add("border-transparent");

  searchContainerEl.classList.remove(animationType);

  const bookmarkSubcontainerEls = bookmarksContainerEl.children;

  for (let i = 0; i < bookmarkSubcontainerEls.length; i++) {
    const bookmarkEls = bookmarkSubcontainerEls[i].children;
    for (let i = 0; i < bookmarkEls.length; i++) {
      const bookmarkEl = bookmarkEls[i];
      bookmarkEl.classList.remove(animationType);
    }
  }
};
