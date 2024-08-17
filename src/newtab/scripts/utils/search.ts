import { Config } from "src/newtab/scripts/config";
import { searchContainerEl, searchInputEl } from "../ui";
import { setTitle } from "src/newtab/scripts/utils/set-title";

export const search = (config: Config, value: string, openInNewTab: boolean = false) => {
  let searchUrl = "";

  if (config.search.useCustomEngine) {
    searchUrl = config.search.customEngineURL.replace("{}", encodeURIComponent(value));
  } else {
    switch (config.search.engine) {
      case "google":
        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
        break;
      case "bing":
        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(value)}`;
        break;
      case "brave":
        searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(value)}`;
        break;
      case "duckduckgo":
        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
        break;
      case "yahoo":
        searchUrl = `https://search.yahoo.com/search?q=${encodeURIComponent(value)}`;
        break;
      case "yandex":
        searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(value)}`;
        break;
      case "startpage":
        searchUrl = `https://www.startpage.com/sp/search?query=${encodeURIComponent(value)}`;
        break;
      case "ecosia":
        searchUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(value)}`;
        break;
    }
  }

  if (openInNewTab) {
    window.open(searchUrl, "_blank");
    searchInputEl.value = "";

    setTitle(config.title.defaultTitle);

    return;
  }

  if (config.animations.enabled) {
    const content = document.getElementById("content") as HTMLDivElement;

    content.classList.add(config.animations.searchType);
    const computedStyle = getComputedStyle(content);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;

    setTimeout(() => {
      content.style.opacity = "0%";
    }, animationDuration * 0.75);

    setTimeout(() => {
      window.location.href = searchUrl;
    }, animationDuration);
  } else {
    window.location.href = searchUrl;
  }
};

export const tryFocusSearch = (config: Config, e: KeyboardEvent) => {
  // in case already focused
  if (searchInputEl.matches(":focus")) return;

  focusSearch(config, e);
};

export const focusSearch = (config: Config, e: Event) => {
  searchContainerEl.classList.remove("border-transparent");
  searchContainerEl.style.borderColor = config.search.focusedBorderColor;

  searchInputEl.focus();
  e.preventDefault();
};

export const unfocusSearch = () => {
  searchInputEl.blur();

  searchContainerEl.style.borderColor = "#00000000";
  searchContainerEl.classList.add("border-transparent");
};
