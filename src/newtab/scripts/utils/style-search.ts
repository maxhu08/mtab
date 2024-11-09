import { UIStyle } from "src/newtab/scripts/config";
import { assistantContainerEl, bookmarkSearchContainerEl, bookmarkSearchInputEl, bookmarkSearchResultsContainerEl, searchContainerEl, searchInputEl } from "src/newtab/scripts/ui";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const styleSearch = (enabled: boolean, style: UIStyle, textColor: string, placeholderTextColor: string, foregroundColor: string, searchIconColor: string, bookmarkIconColor: string, selectIconColor: string) => {
  if (!enabled) {
    searchContainerEl.classList.add("hidden");
  }

  searchInputEl.style.color = textColor;
  bookmarkSearchInputEl.style.color = textColor;
  bookmarkSearchResultsContainerEl.style.color = textColor;

  // const placeholderTextColorCss = `
  // .placeholder-color-search::placeholder {
  //   color: ${placeholderTextColor};
  // }
  // .placeholder-color-bookmark-search::placeholder {
  //   color: ${placeholderTextColor};
  // }
  // .search-search-icon-color {
  //   color: ${searchIconColor};
  // }
  // .search-bookmark-icon-color {
  //   color: ${bookmarkIconColor};
  // }
  // .search-select-icon-color {
  //   color: ${selectIconColor};
  // }
  // `;

  insertCSS(`.placeholder-color-search::placeholder{color:${placeholderTextColor};}.placeholder-color-bookmark-search::placeholder{color:${placeholderTextColor};}.search-search-icon-color{color:${searchIconColor};}.search-bookmark-icon-color{color:${bookmarkIconColor};}.search-select-icon-color{color:${selectIconColor};}`);

  if (style === "solid") {
    searchContainerEl.style.backgroundColor = foregroundColor;
    assistantContainerEl.style.backgroundColor = foregroundColor;
    bookmarkSearchContainerEl.style.backgroundColor = foregroundColor;
    bookmarkSearchResultsContainerEl.style.backgroundColor = foregroundColor;

    return;
  }
  if (style === "glass") {
    searchContainerEl.classList.add("glass-effect");
    assistantContainerEl.classList.add("glass-effect");
    bookmarkSearchContainerEl.classList.add("glass-effect");
    bookmarkSearchResultsContainerEl.classList.add("glass-effect");

    return;
  }
};
