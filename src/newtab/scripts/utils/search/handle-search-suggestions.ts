import {
  renderSearchResults,
  RenderSearchResultsOptions,
  SearchResultItem
} from "src/newtab/scripts/utils/search/handle-search-results";
import { fetchSearchSuggestions } from "./suggestions";
import { Config } from "src/utils/config";
import { bookmarksContainerEl, searchResultsSectionEl } from "src/newtab/scripts/ui";

const debounce = (fn: () => void, ms: number) => {
  let t: number | undefined;
  return () => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(fn, ms);
  };
};

export const showSearchResultsSection = () => {
  bookmarksContainerEl.classList.replace("grid", "hidden");
  searchResultsSectionEl.classList.replace("hidden", "block");
};

export const hideSearchResultsSection = () => {
  bookmarksContainerEl.classList.replace("hidden", "grid");
  searchResultsSectionEl.classList.replace("block", "hidden");
};

export const handleSearchSuggestions = (config: Config, opts: RenderSearchResultsOptions) => {
  const { inputEl, resultsContainerEl, maxResults = 8 } = opts;

  let abort: AbortController | null = null;

  const refresh = async () => {
    const q = inputEl.value.trim();

    if (q === "") {
      resultsContainerEl.innerHTML = "";
      hideSearchResultsSection();
      abort?.abort();
      abort = null;
      return;
    }

    abort?.abort();
    abort = new AbortController();
    const signal = abort.signal;

    const suggestions = await fetchSearchSuggestions(q).catch(() => []);

    if (signal.aborted) return;

    const limited = suggestions.slice(0, maxResults);

    if (limited.length === 0) {
      resultsContainerEl.innerHTML = "";
      hideSearchResultsSection();
      return;
    }

    showSearchResultsSection();

    const items: SearchResultItem[] = limited.map((s) => ({
      name: s,
      value: s
    }));

    renderSearchResults(items, opts);
  };

  const debouncedRefresh = debounce(() => {
    void refresh();
  }, 120);

  inputEl.addEventListener("input", debouncedRefresh);
  inputEl.addEventListener("focus", () => void refresh());

  inputEl.addEventListener("blur", () => {
    if (inputEl.value.trim() === "") hideSearchResultsSection();
  });

  return { refreshResults: refresh };
};
