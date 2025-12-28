// handle-search-results.ts

type SearchResultItem = {
  name: string;
  url: string;
};

type RenderSearchResultsOptions = {
  resultsContainerEl: HTMLElement;
  inputEl: HTMLInputElement;
  textColor: string;
  placeholderTextColor: string;
  maxResults?: number;
  resultUrlAttr?: string;
  selectedIndexAttr?: string;
  resultsSectionEl?: HTMLElement;
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
    resultsSectionEl
  } = opts;

  resultsContainerEl.innerHTML = "";

  // prettier-ignore
  let selectedIndex = parseInt(resultsContainerEl.getAttribute(selectedIndexAttr) as string);

  const searchValue = inputEl.value.toLowerCase();

  let filtered = fuzzySearch(searchValue, items).sort((a, b) => {
    const aContains = a.name.toLowerCase().startsWith(searchValue);
    const bContains = b.name.toLowerCase().startsWith(searchValue);
    return aContains === bContains ? 0 : aContains ? -1 : 1;
  });

  const extraCount = filtered.length - maxResults;
  filtered = filtered.slice(0, maxResults);

  if (selectedIndex > filtered.length - 1) selectedIndex = filtered.length - 1;
  if (selectedIndex < 0) selectedIndex = 0;

  resultsContainerEl.setAttribute(selectedIndexAttr, selectedIndex.toString());

  filtered.forEach((item, index) => {
    const matchedNameHtml = getMatchedNameHtml(
      item.name,
      searchValue,
      textColor,
      placeholderTextColor
    );

    if (index === selectedIndex) {
      // <div bookmark-result-url="${bookmark.url}" class="grid grid-cols-[max-content_auto]">
      //   <span class="search-select-icon-color font-semibold">&nbsp;>&nbsp;</span>
      //   <div class="truncate" style="color:${placeholderTextColor}">${matchedNameHtml}</div>
      // </div>

      const divEl = document.createElement("div");
      divEl.setAttribute(resultUrlAttr, item.url);
      divEl.className = "grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "search-select-icon-color font-semibold";
      spanEl.innerHTML = "&nbsp;>&nbsp;";

      const contentDivEl = document.createElement("div");
      contentDivEl.className = "truncate";
      contentDivEl.style.color = placeholderTextColor;
      contentDivEl.innerHTML = matchedNameHtml;

      divEl.appendChild(spanEl);
      divEl.appendChild(contentDivEl);

      resultsContainerEl.appendChild(divEl);
    } else {
      // <div bookmark-result-url="${bookmark.url}" class="grid grid-cols-[max-content_auto]">
      //   <div>&nbsp;&nbsp;&nbsp;</div>
      //   <div class="truncate" style="color:${placeholderTextColor}">${matchedNameHtml}</div>
      // </div>

      const divEl = document.createElement("div");
      divEl.setAttribute(resultUrlAttr, item.url);
      divEl.className = "grid grid-cols-[max-content_auto]";

      const placeholderDivEl = document.createElement("div");
      placeholderDivEl.innerHTML = "&nbsp;&nbsp;&nbsp;";

      const contentDivEl = document.createElement("div");
      contentDivEl.className = "truncate";
      contentDivEl.style.color = placeholderTextColor;
      contentDivEl.innerHTML = matchedNameHtml;

      divEl.appendChild(placeholderDivEl);
      divEl.appendChild(contentDivEl);

      resultsContainerEl.appendChild(divEl);
    }
  });

  if (filtered.length === 0) {
    // <p class="text-center">No results!</p>

    const pEl = document.createElement("p");
    pEl.className = "text-center";
    pEl.textContent = "No results!";
    resultsContainerEl.appendChild(pEl);
  }

  if (extraCount > 0) {
    // <p style="color:${placeholderTextColor}">&nsbp;&nsbp;&nsbp;(${extraCount} more)</p>

    const extraEl = document.createElement("p");
    extraEl.style.color = placeholderTextColor;
    extraEl.innerHTML = `&nbsp;&nbsp;&nbsp;+${extraCount} more`;
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

  const childrenCount = resultsContainerEl.children.length;
  if (childrenCount === 0) return;

  // prettier-ignore
  const prevIndex = parseInt(resultsContainerEl.getAttribute(selectedIndexAttr) as string);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex = prevIndex < childrenCount - 1 ? prevIndex + 1 : 0;
    resultsContainerEl.setAttribute(selectedIndexAttr, nextIndex.toString());
    refreshResults();
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const nextIndex = prevIndex > 0 ? prevIndex - 1 : childrenCount - 1;
    resultsContainerEl.setAttribute(selectedIndexAttr, nextIndex.toString());
    refreshResults();
    return;
  }

  if (e.key === "Enter" && !e.repeat) {
    e.preventDefault();

    const selectedEl = resultsContainerEl.children[prevIndex] as HTMLElement | undefined;
    if (!selectedEl) return;

    const url = selectedEl.getAttribute(resultUrlAttr);
    if (!url) return;

    onOpen(url, e.ctrlKey);
  }
};
