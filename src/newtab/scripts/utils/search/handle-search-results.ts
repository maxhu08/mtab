type SearchResultItem = {
  name: string;
  url: string;
};

type RenderSearchResultsOptions = {
  resultsContainerEl: HTMLElement;
  inputEl: HTMLInputElement;
  textColor: string;
  placeholderTextColor: string;
  maxResults: number;
  resultUrlAttr: string;
  selectedIndexAttr: string;
  resultsSectionEl: HTMLElement;
  onOpen: (url: string, openInNewTab: boolean) => void;
};

const getButtons = (resultsContainerEl: HTMLElement) => {
  return Array.from(resultsContainerEl.children).filter(
    (el) => (el as HTMLElement).tagName.toLowerCase() === "button"
  ) as HTMLButtonElement[];
};

const clampIndex = (idx: number, len: number) => {
  if (len <= 0) return 0;
  if (idx < 0) return 0;
  if (idx > len - 1) return len - 1;
  return idx;
};

const updateSelectedRow = (
  resultsContainerEl: HTMLElement,
  selectedIndexAttr: string,
  nextIndex: number
) => {
  const buttons = getButtons(resultsContainerEl);
  if (buttons.length === 0) return;

  const clamped = clampIndex(nextIndex, buttons.length);
  resultsContainerEl.setAttribute(selectedIndexAttr, clamped.toString());

  for (let i = 0; i < buttons.length; i++) {
    const el = buttons[i];

    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) continue;

    // first child is either the ">" span or the placeholder div
    if (i === clamped) {
      if (firstChild.tagName.toLowerCase() !== "span") {
        const spanEl = document.createElement("span");
        spanEl.className = "search-select-icon-color font-semibold";
        spanEl.innerHTML = "&nbsp;>&nbsp;";
        el.replaceChild(spanEl, firstChild);
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
    resultsContainerEl,
    inputEl,
    textColor,
    placeholderTextColor,
    maxResults = 8,
    resultUrlAttr = "search-result-url",
    selectedIndexAttr = "selected-index",
    resultsSectionEl,
    onOpen
  } = opts;

  resultsContainerEl.innerHTML = "";

  // prevent input blur when clicking non-button rows (No results / +N more)
  resultsContainerEl.onmousedown = (e) => {
    const target = e.target as HTMLElement | null;
    const isButton = target?.closest("button");
    if (!isButton) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const searchValue = inputEl.value.toLowerCase();

  let filtered = fuzzySearch(searchValue, items).sort((a, b) => {
    const aContains = a.name.toLowerCase().startsWith(searchValue);
    const bContains = b.name.toLowerCase().startsWith(searchValue);
    return aContains === bContains ? 0 : aContains ? -1 : 1;
  });

  const extraCount = filtered.length - maxResults;
  filtered = filtered.slice(0, maxResults);

  // prettier-ignore
  let selectedIndex = parseInt(resultsContainerEl.getAttribute(selectedIndexAttr) as string);

  selectedIndex = clampIndex(selectedIndex, filtered.length);
  resultsContainerEl.setAttribute(selectedIndexAttr, selectedIndex.toString());

  const resultCount = filtered.length;

  filtered.forEach((item, index) => {
    const matchedNameHtml = getMatchedNameHtml(
      item.name,
      searchValue,
      textColor,
      placeholderTextColor
    );

    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    buttonEl.setAttribute(resultUrlAttr, item.url);

    buttonEl.className = [
      "grid grid-cols-[max-content_auto] cursor-pointer select-none text-left hover:bg-white/20 duration-0",
      getResultPaddingClass(index, resultCount)
    ].join(" ");

    buttonEl.addEventListener("mousedown", (e) => {
      const me = e as MouseEvent;

      if (me.button !== 0 && me.button !== 1) return;

      e.preventDefault();
      e.stopPropagation();

      const openInNewTab = me.button === 1 || me.ctrlKey || me.metaKey;
      onOpen(item.url, openInNewTab);
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

    buttonEl.addEventListener("mouseenter", () => {
      updateSelectedRow(resultsContainerEl, selectedIndexAttr, index);
    });

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

    resultsContainerEl.appendChild(buttonEl);
  });

  if (filtered.length === 0) {
    // <p class="text-center">No results!</p>

    const pEl = document.createElement("p");
    pEl.className = "px-2 py-2 text-center select-none";
    pEl.textContent = "No results!";

    // prevent input blur -> prevents results from disappearing
    pEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    resultsContainerEl.appendChild(pEl);
  }

  if (extraCount > 0) {
    // <p style="color:${placeholderTextColor}">&nsbp;&nsbp;&nsbp;(${extraCount} more)</p>

    const extraEl = document.createElement("p");
    extraEl.className = "px-2 py-2 select-none";
    extraEl.style.color = placeholderTextColor;
    extraEl.innerHTML = `&nbsp;&nbsp;&nbsp;+${extraCount} more`;

    // prevent input blur -> prevents results from disappearing
    extraEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    resultsContainerEl.appendChild(extraEl);
  }

  if (resultsSectionEl) {
    resultsSectionEl.classList.replace("hidden", "grid");
  }
};

const getMatchedNameHtml = (
  name: string,
  searchValue: string,
  textColor: string,
  placeholderTextColor: string
) => {
  let result = "";
  let searchIndex = 0;

  for (let i = 0; i < name.length; i++) {
    if (
      searchIndex < searchValue.length &&
      name[i].toLowerCase() === searchValue[searchIndex].toLowerCase()
    ) {
      result += `<span style="color: ${textColor};">${name[i]}</span>`;
      searchIndex++;
    } else {
      result += `<span style="color: ${placeholderTextColor};">${name[i]}</span>`;
    }
  }

  return result;
};

const fuzzySearch = (search: string, items: SearchResultItem[]) => {
  if (search === "") return items;

  const results = items.filter((item) => {
    let searchIndex = 0;
    const name = item.name;

    for (let i = 0; i < name.length; i++) {
      if (name[i].toLowerCase() === search[searchIndex].toLowerCase()) {
        searchIndex++;
      }
      if (searchIndex === search.length) {
        return true;
      }
    }

    return false;
  });

  return results;
};

type HandleSearchResultsNavigationOptions = {
  resultsContainerEl: HTMLElement;
  selectedIndexAttr?: string;
  resultUrlAttr?: string;
  refreshResults: () => void;
  onOpen: (url: string, openInNewTab: boolean) => void;
};

export const handleSearchResultsNavigation = (
  e: KeyboardEvent,
  opts: HandleSearchResultsNavigationOptions
) => {
  const {
    resultsContainerEl,
    refreshResults,
    onOpen,
    selectedIndexAttr = "selected-index",
    resultUrlAttr = "bookmark-result-url"
  } = opts;

  const buttons = getButtons(resultsContainerEl);
  const count = buttons.length;
  if (count === 0) return;

  // prettier-ignore
  const prevIndex = parseInt(resultsContainerEl.getAttribute(selectedIndexAttr) as string);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex = prevIndex < count - 1 ? prevIndex + 1 : 0;
    updateSelectedRow(resultsContainerEl, selectedIndexAttr, nextIndex);
    refreshResults();
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const nextIndex = prevIndex > 0 ? prevIndex - 1 : count - 1;
    updateSelectedRow(resultsContainerEl, selectedIndexAttr, nextIndex);
    refreshResults();
    return;
  }

  if (e.key === "Enter" && !e.repeat) {
    e.preventDefault();

    const idx = clampIndex(prevIndex, count);
    const selectedEl = buttons[idx] as HTMLElement | undefined;
    if (!selectedEl) return;

    const url = selectedEl.getAttribute(resultUrlAttr);
    if (!url) return;

    onOpen(url, e.ctrlKey);
  }
};
