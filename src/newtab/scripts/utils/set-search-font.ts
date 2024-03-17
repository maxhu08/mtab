export const setSearchFont = (font: string) => {
  const searchFontCss = `
.font-search {
  font-family: ${font};
}`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(searchFontCss));
  document.head.appendChild(styleElement);
};
