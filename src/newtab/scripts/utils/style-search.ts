import { UIStyle, FontType } from "src/utils/config";
import {
  bookmarkSearchContainerEl,
  bookmarkSearchInputEl,
  searchResultsContainerEl,
  searchContainerEl,
  searchInputEl
} from "src/newtab/scripts/ui";
import { getFontNameFromURL } from "src/newtab/scripts/utils/get-font-name";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const styleSearch = (
  style: UIStyle,
  foregroundColor: string,
  enabled: boolean,
  textColor: string,
  placeholderTextColor: string,
  searchIconColor: string,
  bookmarkIconColor: string,
  selectIconColor: string,
  placeholderText: string,
  bookmarkPlaceholderText: string,
  fontType: FontType,
  fontCustom: string
) => {
  if (!enabled) searchContainerEl.classList.add("hidden");

  searchInputEl.style.color = textColor;
  bookmarkSearchInputEl.style.color = textColor;
  searchResultsContainerEl.style.color = textColor;

  searchInputEl.placeholder = placeholderText;
  bookmarkSearchInputEl.placeholder = bookmarkPlaceholderText;

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
  insertCSS(
    `.placeholder-color-search::placeholder{color:${placeholderTextColor};}.placeholder-color-bookmark-search::placeholder{color:${placeholderTextColor};}.search-search-icon-color{color:${searchIconColor};}.search-bookmark-icon-color{color:${bookmarkIconColor};}.search-select-icon-color{color:${selectIconColor};}`
  );

  if (fontType === "default") {
    const font = '"Jetbrains-Mono-Regular-Fixed"';
    // const searchFontCss = `
    // .font-search {
    //   font-family: ${font};
    // }
    // .font-bookmark-search {
    //   font-family: ${font};
    // }
    // .font-search-results {
    //   font-family: ${font};
    // }`;
    insertCSS(
      `.font-search{font-family:${font};}.font-bookmark-search{font-family:${font};}.font-search-results{font-family:${font};}`
    );
  } else {
    // @import url('${fontCustom}');
    // .font-search { font-family: "${fontName}", sans-serif !important; }
    // .font-bookmark-search { font-family: "${fontName}", sans-serif !important; }
    // .font-search-results { font-family: "${fontName}", sans-serif !important; }

    const fontName = getFontNameFromURL(fontCustom);
    insertCSS(
      `@import url("${fontCustom}");.font-search{font-family:"${fontName}",sans-serif!important;}.font-bookmark-search{font-family:"${fontName}",sans-serif!important;}.font-search-results{font-family:"${fontName}",sans-serif!important;}`
    );
  }

  // apply styles based on UIStyle
  if (style === "solid") {
    searchContainerEl.classList.add("bg-foreground");
    bookmarkSearchContainerEl.classList.add("bg-foreground");
    searchResultsContainerEl.classList.add("bg-foreground");
  } else if (style === "glass") {
    searchContainerEl.classList.add("glass-effect");
    bookmarkSearchContainerEl.classList.add("glass-effect");
    searchResultsContainerEl.classList.add("glass-effect");
  }
};
