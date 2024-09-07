export const insertCss = (css: string) => {
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(css));
  document.head.appendChild(styleElement);
};
