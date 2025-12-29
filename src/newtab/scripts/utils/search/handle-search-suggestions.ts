import {
  renderSearchResults,
  RenderSearchResultsOptions,
  SearchResultItem
} from "src/newtab/scripts/utils/search/handle-search-results";
import { fetchSearchSuggestions } from "./suggestions";
import { Config } from "src/utils/config";

const debounce = (fn: () => void, ms: number) => {
  let t: number | undefined;
  return () => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(fn, ms);
  };
};

const showSearchResultsSection = (sectionEl: HTMLElement) => {
  sectionEl.classList.remove("hidden");
  sectionEl.classList.add("block");
};

const hideSearchResultsSection = (sectionEl: HTMLElement) => {
  sectionEl.classList.add("hidden");
  sectionEl.classList.remove("block");
};

export const handleSearchSuggestions = (config: Config, opts: RenderSearchResultsOptions) => {
  const { inputEl, resultsContainerEl, resultsSectionEl, maxResults = 8 } = opts;

  let abort: AbortController | null = null;

  const refresh = async () => {
    const q = inputEl.value.trim();

    if (q === "") {
      resultsContainerEl.innerHTML = "";
      hideSearchResultsSection(resultsSectionEl);
      abort?.abort();
      abort = null;
      return;
    }

    abort?.abort();
    abort = new AbortController();
    const signal = abort.signal;

    const suggestions = await fetchSearchSuggestions(q).catch(() => []);

    console.log("[handleSearchSuggestions] got suggestions", suggestions);

    if (signal.aborted) return;

    const limited = suggestions.slice(0, maxResults);

    if (limited.length === 0) {
      resultsContainerEl.innerHTML = "";
      hideSearchResultsSection(resultsSectionEl);
      return;
    }

    showSearchResultsSection(resultsSectionEl);

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
    if (inputEl.value.trim() === "") hideSearchResultsSection(resultsSectionEl);
  });

  return { refreshResults: refresh };
};
