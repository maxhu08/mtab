import { bookmarkSearchInputEl, searchInputEl } from "src/newtab/scripts/ui";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const setSearchStuff = (font: string, placeholderText: string, bookmarkPlaceholderText: string) => {
  // const searchFontCss = `
  // .font-search {
  //   font-family: ${font};
  // }
  // .font-bookmark-search {
  //   font-family: ${font};
  // }
  // .font-bookmark-search-results {
  //   font-family: ${font};
  // }`;

  insertCSS(`.font-search{font-family:${font};}.font-bookmark-search{font-family:${font};}.font-bookmark-search-results{font-family:${font};}`);

  searchInputEl.placeholder = placeholderText;
  bookmarkSearchInputEl.placeholder = bookmarkPlaceholderText;
};
