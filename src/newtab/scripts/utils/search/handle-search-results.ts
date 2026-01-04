import { searchResultsContainerEl, searchResultsSectionEl } from "src/newtab/scripts/ui";
import { recognizeUrl } from "src/newtab/scripts/utils/search/recognize-url";

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

    if (i === clamped) el.classList.add("bg-white/20");
    else el.classList.remove("bg-white/20");

    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) continue;

    if (i === clamped) {
      if (firstChild.tagName.toLowerCase() !== "span") {
        const spanEl = document.createElement("span");
        spanEl.className = "search-select-icon-color font-semibold";
        spanEl.innerHTML = "&nbsp;>&nbsp;";
        el.replaceChild(spanEl, firstChild);

        if (inputEl.id !== "bookmark-search-input") {
          inputEl.value = el.getAttribute("search-result-value") || "";
        }
      }
    } else {
      if (firstChild.tagName.toLowerCase() !== "div") {
        const placeholderDivEl = document.createElement("div");
        placeholderDivEl.innerHTML = "&nbsp;&nbsp;&nbsp;";
        el.replaceChild(placeholderDivEl, firstChild);
      }
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

  searchResultsContainerEl.innerHTML = "";

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

  let filtered = fuzzySearch(searchValue, items).sort((a, b) => {
    const aContains = a.name.toLowerCase().startsWith(searchValue);
    const bContains = b.name.toLowerCase().startsWith(searchValue);
    return aContains === bContains ? 0 : aContains ? -1 : 1;
  });

  // force the current input as first item (normal search only)
  if (!isBookmarkInput) {
    const q = rawValue.trim();
    if (q) {
      const qLower = q.toLowerCase();

      // remove duplicates of the same text
      filtered = filtered.filter((it) => it.name.trim().toLowerCase() !== qLower);

      const recognized = recognizeLinks ? recognizeUrl(q) : null;

      // put current query at the top
      filtered.unshift({
        name: q,
        value: recognized ?? q,
        directLink: recognized !== null
      });
    }
  }

  filtered = filtered.slice(0, MAX_RESULTS);

  let selectedIndex = parseInt(
    searchResultsContainerEl.getAttribute(SELECTED_INDEX_ATTR) as string
  );

  selectedIndex = clampIndex(selectedIndex, filtered.length);
  searchResultsContainerEl.setAttribute(SELECTED_INDEX_ATTR, selectedIndex.toString());

  const resultCount = filtered.length;

  filtered.forEach((item, index) => {
    const matchedNameHtml = getMatchedNameHtml(
      item.name,
      searchValue,
      textColor,
      placeholderTextColor,
      linkTextColor,
      item.directLink
    );

    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    buttonEl.setAttribute(resultUrlAttr, item.value);
    buttonEl.setAttribute("search-result-value", item.name);

    buttonEl.className = [
      "grid grid-cols-[max-content_auto] cursor-pointer select-none text-left hover:bg-white/20 duration-0",
      getResultPaddingClass(index, resultCount)
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

    if (index === selectedIndex) {
      const spanEl = document.createElement("span");
      spanEl.className = "search-select-icon-color font-semibold";
      spanEl.innerHTML = "&nbsp;>&nbsp;";

      const contentDivEl = document.createElement("div");
      contentDivEl.className = "truncate";
      contentDivEl.style.color = placeholderTextColor;
      contentDivEl.innerHTML = matchedNameHtml;

      buttonEl.appendChild(spanEl);
      buttonEl.appendChild(contentDivEl);
    } else {
      const placeholderDivEl = document.createElement("div");
      placeholderDivEl.innerHTML = "&nbsp;&nbsp;&nbsp;";

      const contentDivEl = document.createElement("div");
      contentDivEl.className = "truncate";
      contentDivEl.style.color = placeholderTextColor;
      contentDivEl.innerHTML = matchedNameHtml;

      buttonEl.appendChild(placeholderDivEl);
      buttonEl.appendChild(contentDivEl);
    }

    searchResultsContainerEl.appendChild(buttonEl);
  });

  if (filtered.length === 0) {
    const pEl = document.createElement("p");
    pEl.className = "px-2 py-2 text-center select-none";
    pEl.textContent = "No results!";
    pEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    searchResultsContainerEl.appendChild(pEl);
  }

  searchResultsSectionEl.classList.replace("hidden", "block");
};

const getMatchedNameHtml = (
  name: string,
  searchValue: string,
  textColor: string,
  placeholderTextColor: string,
  linkTextColor: string,
  directLink: boolean
) => {
  let result = "";
  let searchIndex = 0;

  const matchColor = directLink ? linkTextColor : textColor;

  for (let i = 0; i < name.length; i++) {
    if (
      searchIndex < searchValue.length &&
      name[i].toLowerCase() === searchValue[searchIndex].toLowerCase()
    ) {
      result += `<span style="color: ${matchColor};">${name[i]}</span>`;
      searchIndex++;
    } else {
      result += `<span style="color: ${placeholderTextColor};">${name[i]}</span>`;
    }
  }

  return result;
};

const fuzzySearch = (search: string, items: SearchResultItem[]) => {
  if (search === "") return items;

  return items.filter((item) => {
    let searchIndex = 0;
    const name = item.name;

    for (let i = 0; i < name.length; i++) {
      if (name[i].toLowerCase() === search[searchIndex].toLowerCase()) {
        searchIndex++;
      }
      if (searchIndex === search.length) return true;
    }
    return false;
  });
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

  const prevIndex = parseInt(searchResultsContainerEl.getAttribute(SELECTED_INDEX_ATTR) as string);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex = prevIndex < count - 1 ? prevIndex + 1 : 0;
    updateSelectedRow(inputEl, nextIndex);
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const nextIndex = prevIndex > 0 ? prevIndex - 1 : count - 1;
    updateSelectedRow(inputEl, nextIndex);
    return;
  }

  if (e.key === "Enter" && !e.repeat) {
    e.preventDefault();

    const idx = clampIndex(prevIndex, count);
    const selectedEl = buttons[idx];
    if (!selectedEl) return;

    const url = selectedEl.getAttribute(resultUrlAttr);
    if (!url) return;

    onOpen(url, e.ctrlKey);
  }
};
