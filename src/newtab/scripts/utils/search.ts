import { config } from "../config";
import { searchContainerEl, searchInputEl } from "../ui";

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

  const content = document.getElementById("content") as HTMLDivElement;
  content.classList.add("animate-page-shrink");

  const animationDuration = 500;

  setTimeout(() => {
    content.classList.remove("animate-page-shrink");
    content.style.opacity = "0";
  }, animationDuration * 0.75);

  setTimeout(() => {
    window.location.href = searchUrl;
  }, animationDuration);
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
