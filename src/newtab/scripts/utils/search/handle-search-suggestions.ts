import {
  renderSearchResults,
  RenderSearchResultsOptions,
  SearchResultItem,
  SELECTED_INDEX_ATTR
} from "src/newtab/scripts/utils/search/handle-search-results";
import { fetchSearchSuggestions } from "./suggestions";
import {
  bookmarksContainerEl,
  searchResultsContainerEl,
  searchResultsSectionEl
} from "src/newtab/scripts/ui";
import { recognizeUrl } from "src/newtab/scripts/utils/search/recognize-url";

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

const uniq = (arr: string[]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const v = s.trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
};

export const handleSearchSuggestions = (opts: RenderSearchResultsOptions) => {
  const { inputEl } = opts;

  let abort: AbortController | null = null;

  let items: SearchResultItem[] = [];

  const refresh = async () => {
    const q = inputEl.value.trim();

    if (q === "") {
      searchResultsContainerEl.innerHTML = "";
      hideSearchResultsSection();
      abort?.abort();
      abort = null;
      items = [];
      return;
    }

    abort?.abort();
    abort = new AbortController();
    const signal = abort.signal;

    const suggestions = await fetchSearchSuggestions(q).catch(() => []);

    if (signal.aborted) return;

    // include the original query first, then suggestions, de-duped, max 8 total
    const merged = uniq([q, ...suggestions]).slice(0);

    if (merged.length === 0) {
      searchResultsContainerEl.innerHTML = "";
      hideSearchResultsSection();
      items = [];
      return;
    }

    showSearchResultsSection();

    items = merged.map((s) => {
      const recognized = recognizeUrl(s);
      return {
        name: s,
        value: recognized ?? s,
        directLink: recognized !== null
      };
    });

    renderSearchResults(items, opts);
    searchResultsContainerEl.setAttribute(SELECTED_INDEX_ATTR, "0");
  };

  const debouncedRefresh = debounce(() => {
    refresh();
  }, 120);

  inputEl.addEventListener("input", () => {
    showSearchResultsSection();

    const raw = inputEl.value;
    const recognized = recognizeUrl(raw);

    items = [
      {
        name: raw,
        value: recognized ?? raw,
        directLink: recognized !== null
      }
    ];

    renderSearchResults(items, opts);
    searchResultsContainerEl.setAttribute(SELECTED_INDEX_ATTR, "0");

    debouncedRefresh();
  });

  inputEl.addEventListener("focus", () => {
    if (inputEl.value.trim() !== "" && items.length > 0) {
      searchResultsContainerEl.setAttribute(SELECTED_INDEX_ATTR, "0");
      showSearchResultsSection();
      renderSearchResults(items, opts);
    }
  });

  inputEl.addEventListener("blur", () => {
    // if the window lost focus
    if (!document.hasFocus()) return;

    hideSearchResultsSection();
  });

  return { refreshResults: refresh };
};
