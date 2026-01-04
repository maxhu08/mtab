import { Config, SearchEngine } from "src/utils/config";
import { searchContainerEl, searchInputEl } from "../ui";
import { setTitle } from "src/newtab/scripts/utils/set-title";
import { hideSearchResultsSection } from "src/newtab/scripts/utils/search/handle-search-suggestions";

export const openUrl = (config: Config, url: string, openInNewTab: boolean = false) => {
  if (openInNewTab) {
    window.open(url, "_blank");

    // hide search results and clear input
    searchInputEl.value = "";
    hideSearchResultsSection();

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
    }, animationDuration - 10);

    setTimeout(() => {
      window.location.href = url;
    }, animationDuration);
  } else {
    window.location.href = url;
  }
};

export const search = (config: Config, value: string, openInNewTab: boolean = false) => {
  const searchUrlMap: Record<SearchEngine, string> = {
    google: "https://www.google.com/search?q=",
    bing: "https://www.bing.com/search?q=",
    brave: "https://search.brave.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q=",
    yahoo: "https://search.yahoo.com/search?q=",
    yandex: "https://yandex.com/search/?text=",
    startpage: "https://www.startpage.com/sp/search?query=",
    ecosia: "https://www.ecosia.org/search?q=",
    kagi: "https://kagi.com/search?q="
  };

  const url = config.search.useCustomEngine
    ? config.search.customEngineURL.replace("{}", encodeURIComponent(value))
    : searchUrlMap[config.search.engine] + encodeURIComponent(value);

  return openUrl(config, url, openInNewTab);
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
