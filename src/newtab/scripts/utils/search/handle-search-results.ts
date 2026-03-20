import { searchResultsContainerEl, searchResultsSectionEl } from "~/src/newtab/scripts/ui";
import { recognizeUrl } from "~/src/newtab/scripts/utils/search/recognize-url";
import { setSearchValue } from "~/src/newtab/scripts/utils/search/set-search-value";

export const SELECTED_INDEX_ATTR = "selected-index";
export const MAX_RESULTS = 8;

export type SearchResultItem = { name: string; value: string; directLink: boolean };

export type RenderSearchResultsOptions = {
  inputEl: HTMLInputElement;
  textColor: string;
  placeholderTextColor: string;
  linkTextColor: string;
  recognizeLinks: boolean;
  resultUrlAttr: string;
  onOpen: (url: string, openInNewTab: boolean) => void;
};

type AnalyzedSearchResultItem = {
  item: SearchResultItem;
  trimmedNameLower: string;
  directStartsWithQuery: boolean;
  highlightRanges: boolean[];
};

const ICON_CLASS = "sr-icon";

const getButtons = () => {
  return Array.from(searchResultsContainerEl.children).filter(
    (el) => (el as HTMLElement).tagName.toLowerCase() === "button"
  ) as HTMLButtonElement[];
};

const clampIndex = (idx: number, len: number) => {
  if (len <= 0) return 0;
  if (idx < 0) return 0;
  if (idx > len - 1) return len - 1;
  return idx;
};

const updateSelectedRow = (inputEl: HTMLInputElement, nextIndex: number) => {
  const buttons = getButtons();
  if (buttons.length === 0) return;

  const clamped = clampIndex(nextIndex, buttons.length);
  searchResultsContainerEl.setAttribute(SELECTED_INDEX_ATTR, clamped.toString());

  for (let i = 0; i < buttons.length; i++) {
    const el = buttons[i];
    const selected = i === clamped;
    if (selected) el.classList.add("bg-white/20");
    else el.classList.remove("bg-white/20");
    el.setAttribute("aria-selected", selected ? "true" : "false");

    const iconEl = el.querySelector(`.${ICON_CLASS}`) as HTMLElement | null;
    if (iconEl) iconEl.textContent = selected ? " > " : "   ";

    if (selected) searchResultsContainerEl.setAttribute("aria-activedescendant", el.id);

    if (selected && inputEl.id !== "bookmark-search-input") {
      setSearchValue(el.getAttribute("search-result-value") || "", false);
    }
  }
};

const getResultPaddingClass = (index: number, total: number) => {
  if (total <= 1) return "px-2 py-2";
  if (index === 0) return "px-2 pt-2 pb-1";
  if (index === total - 1) return "px-2 pt-1 pb-2";
  return "px-2 py-1";
};

export const renderSearchResults = (
  items: SearchResultItem[],
  opts: RenderSearchResultsOptions
) => {
  const {
    inputEl,
    textColor,
    placeholderTextColor,
    linkTextColor,
    recognizeLinks,
    resultUrlAttr = "search-result-url",
    onOpen
  } = opts;

  const frag = document.createDocumentFragment();
  searchResultsContainerEl.setAttribute("role", "listbox");
  searchResultsContainerEl.setAttribute(
    "aria-label",
    inputEl.id === "bookmark-search-input" ? "Bookmark search results" : "Search results"
  );

  searchResultsContainerEl.onmousedown = (e) => {
    const target = e.target as HTMLElement | null;
    const isButton = target?.closest("button");
    if (!isButton) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const searchValue = inputEl.value.toLowerCase();
  const rawValue = inputEl.value;
  const isBookmarkInput = inputEl.id === "bookmark-search-input";

  let filtered = analyzeSearchResults(searchValue, items);

  if (!isBookmarkInput) {
    const q = rawValue.trim();
    if (q) {
      const qLower = q.toLowerCase();
      filtered = filtered.filter((entry) => entry.trimmedNameLower !== qLower);
      const recognized = recognizeLinks ? recognizeUrl(q) : null;
      filtered.unshift({
        item: {
          name: q,
          value: recognized ?? q,
          directLink: Boolean(recognized)
        },
        trimmedNameLower: qLower,
        directStartsWithQuery: true,
        highlightRanges: getHighlightRanges(q, searchValue)
      });
    }
  }

  const overflow = Math.max(0, filtered.length - MAX_RESULTS);
  const visible = filtered.slice(0, MAX_RESULTS);

  let selectedIndex = parseInt(
    searchResultsContainerEl.getAttribute(SELECTED_INDEX_ATTR) || "0",
    10
  );
  selectedIndex = clampIndex(selectedIndex, visible.length);
  searchResultsContainerEl.setAttribute(SELECTED_INDEX_ATTR, selectedIndex.toString());

  const totalRows = visible.length + (isBookmarkInput && overflow > 0 ? 1 : 0);

  visible.forEach(({ item, highlightRanges }, index) => {
    const matchedNameHtml = getMatchedNameHtml(
      item.name,
      textColor,
      placeholderTextColor,
      linkTextColor,
      item.directLink,
      highlightRanges
    );

    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    const optionId = `${inputEl.id}-result-${index}`;
    buttonEl.id = optionId;
    buttonEl.setAttribute("role", "option");
    buttonEl.setAttribute("aria-selected", index === selectedIndex ? "true" : "false");
    buttonEl.setAttribute(resultUrlAttr, item.value);
    buttonEl.setAttribute("search-result-value", item.name);

    buttonEl.className = [
      "grid grid-cols-[3ch_auto] cursor-pointer select-none text-left hover:bg-white/20 focus-visible:bg-white/20 outline-none focus-visible:outline-none duration-0",
      getResultPaddingClass(index, totalRows)
    ].join(" ");

    if (index === selectedIndex) buttonEl.classList.add("bg-white/20");

    buttonEl.addEventListener("mousedown", (e) => {
      const me = e as MouseEvent;
      if (me.button !== 0 && me.button !== 1) return;
      e.preventDefault();
      e.stopPropagation();
      const openInNewTab = me.button === 1 || me.ctrlKey || me.metaKey;
      onOpen(item.value, openInNewTab);
    });

    const stopMiddlePaste = (e: MouseEvent) => {
      if (e.button !== 1) return;
      e.preventDefault();
      e.stopPropagation();
      // @ts-ignore
      e.stopImmediatePropagation?.();
    };

    buttonEl.addEventListener("mousedown", stopMiddlePaste);
    buttonEl.addEventListener("mouseup", stopMiddlePaste);
    buttonEl.addEventListener("auxclick", stopMiddlePaste);

    const iconEl = document.createElement("span");
    iconEl.className = `${ICON_CLASS} search-select-icon-color font-semibold whitespace-pre`;
    iconEl.textContent = index === selectedIndex ? " > " : "   ";

    const contentDivEl = document.createElement("div");
    contentDivEl.className = "truncate";
    contentDivEl.style.color = placeholderTextColor;
    contentDivEl.innerHTML = matchedNameHtml;

    buttonEl.appendChild(iconEl);
    buttonEl.appendChild(contentDivEl);

    frag.appendChild(buttonEl);
  });

  const activeOptionEl = frag.querySelector?.(
    `button[aria-selected="true"]`
  ) as HTMLButtonElement | null;
  if (activeOptionEl) {
    searchResultsContainerEl.setAttribute("aria-activedescendant", activeOptionEl.id);
  } else {
    searchResultsContainerEl.removeAttribute("aria-activedescendant");
  }

  if (isBookmarkInput && overflow > 0) {
    const moreEl = document.createElement("div");
    moreEl.className = [
      "grid grid-cols-[3ch_auto] select-none",
      getResultPaddingClass(totalRows - 1, totalRows)
    ].join(" ");
    moreEl.setAttribute("aria-hidden", "true");
    moreEl.tabIndex = -1;
    moreEl.style.pointerEvents = "none";

    const iconElSpacer = document.createElement("span");
    iconElSpacer.className = `${ICON_CLASS} whitespace-pre`;
    iconElSpacer.textContent = "   ";

    const textEl = document.createElement("div");
    textEl.className = "truncate";
    textEl.style.color = placeholderTextColor;
    textEl.textContent = `+${overflow} more`;

    moreEl.appendChild(iconElSpacer);
    moreEl.appendChild(textEl);

    frag.appendChild(moreEl);
  }

  if (visible.length === 0) {
    const pEl = document.createElement("p");
    pEl.className = "px-2 py-2 text-center select-none";
    pEl.setAttribute("role", "status");
    pEl.setAttribute("aria-live", "polite");
    pEl.textContent = "No results!";
    pEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    frag.appendChild(pEl);
  }

  searchResultsContainerEl.replaceChildren(frag);
  searchResultsSectionEl.classList.replace("hidden", "block");
};

const getMatchedNameHtml = (
  name: string,
  textColor: string,
  placeholderTextColor: string,
  linkTextColor: string,
  directLink: boolean,
  highlightRanges: boolean[]
) => {
  const matchColor = directLink ? linkTextColor : textColor;

  return Array.from(name)
    .map((char, index) => {
      const color = highlightRanges[index] ? matchColor : placeholderTextColor;
      return `<span style="color:${color};">${escapeHtml(char)}</span>`;
    })
    .join("");
};

const getHighlightRanges = (name: string, searchValue: string) => {
  const contiguousMatch = getContiguousMatchRanges(name, searchValue);
  if (contiguousMatch) return contiguousMatch;

  return getFuzzyMatchRanges(name, searchValue) ?? Array.from(name, () => false);
};

const getContiguousMatchRanges = (name: string, searchValue: string) => {
  const ranges: boolean[] = Array.from(name, () => false);
  const query = searchValue.trim().toLowerCase();

  if (!query) return null;

  const nameLower = name.toLowerCase();
  const directMatchIndex = nameLower.indexOf(query);

  if (directMatchIndex === -1) return null;

  for (let i = directMatchIndex; i < directMatchIndex + query.length; i++) {
    ranges[i] = true;
  }

  return ranges;
};

const getFuzzyMatchRanges = (name: string, searchValue: string) => {
  const ranges: boolean[] = Array.from(name, () => false);
  const query = searchValue.toLowerCase();
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return null;

  const nameLower = name.toLowerCase();
  let queryIndex = 0;
  let matchedChars = 0;

  for (let i = 0; i < nameLower.length && queryIndex < query.length; i++) {
    while (query[queryIndex] === " ") queryIndex++;
    if (queryIndex >= query.length) break;

    if (nameLower[i] !== query[queryIndex]) continue;

    ranges[i] = true;
    queryIndex++;
    matchedChars++;
  }

  while (query[queryIndex] === " ") queryIndex++;

  if (queryIndex !== query.length || matchedChars === 0) return null;

  return ranges;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const analyzeSearchResults = (
  searchValue: string,
  items: SearchResultItem[]
): AnalyzedSearchResultItem[] => {
  if (searchValue === "") {
    return items.map((item) => ({
      item,
      trimmedNameLower: item.name.trim().toLowerCase(),
      directStartsWithQuery: true,
      highlightRanges: Array.from(item.name, () => false)
    }));
  }

  const analyzed: AnalyzedSearchResultItem[] = [];

  for (const item of items) {
    const nameLower = item.name.toLowerCase();
    const highlightRanges = getFuzzyMatchRangesFromLowerName(nameLower, searchValue);
    if (!highlightRanges) continue;

    analyzed.push({
      item,
      trimmedNameLower: item.name.trim().toLowerCase(),
      directStartsWithQuery: nameLower.startsWith(searchValue),
      highlightRanges:
        getContiguousMatchRangesFromLowerName(nameLower, searchValue) ?? highlightRanges
    });
  }

  analyzed.sort((a, b) => {
    return a.directStartsWithQuery === b.directStartsWithQuery
      ? 0
      : a.directStartsWithQuery
        ? -1
        : 1;
  });

  return analyzed;
};

const getContiguousMatchRangesFromLowerName = (nameLower: string, searchValue: string) => {
  const ranges: boolean[] = Array.from(nameLower, () => false);
  const query = searchValue.trim();

  if (!query) return null;

  const directMatchIndex = nameLower.indexOf(query);

  if (directMatchIndex === -1) return null;

  for (let i = directMatchIndex; i < directMatchIndex + query.length; i++) {
    ranges[i] = true;
  }

  return ranges;
};

const getFuzzyMatchRangesFromLowerName = (nameLower: string, searchValue: string) => {
  const ranges: boolean[] = Array.from(nameLower, () => false);
  const query = searchValue;
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return null;

  let queryIndex = 0;
  let matchedChars = 0;

  for (let i = 0; i < nameLower.length && queryIndex < query.length; i++) {
    while (query[queryIndex] === " ") queryIndex++;
    if (queryIndex >= query.length) break;

    if (nameLower[i] !== query[queryIndex]) continue;

    ranges[i] = true;
    queryIndex++;
    matchedChars++;
  }

  while (query[queryIndex] === " ") queryIndex++;

  if (queryIndex !== query.length || matchedChars === 0) return null;

  return ranges;
};

type HandleSearchResultsNavigationOptions = {
  resultUrlAttr: string;
  onOpen: (url: string, openInNewTab: boolean) => void;
};

export const handleSearchResultsNavigation = (
  inputEl: HTMLInputElement,
  e: KeyboardEvent,
  opts: HandleSearchResultsNavigationOptions
) => {
  const { onOpen, resultUrlAttr } = opts;
  const buttons = getButtons();
  const count = buttons.length;
  if (count === 0) return;

  const prevIndex = parseInt(searchResultsContainerEl.getAttribute(SELECTED_INDEX_ATTR) || "0", 10);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    updateSelectedRow(inputEl, prevIndex < count - 1 ? prevIndex + 1 : 0);
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    updateSelectedRow(inputEl, prevIndex > 0 ? prevIndex - 1 : count - 1);
    return;
  }

  if (e.key === "Enter" && !e.repeat) {
    e.preventDefault();
    const idx = clampIndex(prevIndex, count);
    const selectedEl = buttons[idx];
    if (!selectedEl) return;
    const url = selectedEl.getAttribute(resultUrlAttr);
    if (!url) return;
    onOpen(url, e.ctrlKey || e.metaKey);
  }
};