import { searchInputEl } from "src/newtab/scripts/ui";

export const setSearchStuff = (font: string, placeholderText: string) => {
  const searchFontCss = `
.font-search {
  font-family: ${font};
}`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(searchFontCss));
  document.head.appendChild(styleElement);

  searchInputEl.placeholder = placeholderText;
};
