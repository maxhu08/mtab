import { config } from "src/scripts/config";
import { searchContainerEl, searchInputEl } from "src/scripts/ui";

export const search = (value: string) => {
  let searchUrl = "";

  switch (config.search.engine) {
    case "google":
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
      break;
    case "bing":
      searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(value)}`;
      break;
    case "duckduckgo":
      searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
      break;
  }

  window.location.href = searchUrl;
};

export const tryFocusSearch = (e: KeyboardEvent) => {
  // in case already focused
  if (searchInputEl.matches(":focus")) return;

  focusSearch(e);
};

export const focusSearch = (e: Event) => {
  searchContainerEl.classList.replace("border-transparent", config.search.focusedBorderClass);
  searchInputEl.focus();
  e.preventDefault();
};

export const unfocusSearch = () => {
  searchInputEl.blur();

  searchContainerEl.classList.replace(config.search.focusedBorderClass, "border-transparent");
};
