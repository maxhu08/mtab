export const setMessageFont = (font: string) => {
  const messageFontCss = `
.font-message {
  font-family: ${font};
}`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(messageFontCss));
  document.head.appendChild(styleElement);
};
