import { bookmarkSearchInputEl, searchInputEl } from "src/newtab/scripts/ui";

export const setSearchStuff = (
  font: string,
  placeholderText: string,
  bookmarkPlaceholderText: string
) => {
  const searchFontCss = `
.font-search {
  font-family: ${font};
}
.font-bookmark-search {
  font-family: ${font};
} 
.font-bookmark-search-results {
  font-family: ${font};
} 
`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(searchFontCss));
  document.head.appendChild(styleElement);

  searchInputEl.placeholder = placeholderText;
  bookmarkSearchInputEl.placeholder = bookmarkPlaceholderText;
};
