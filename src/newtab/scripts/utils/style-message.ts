import { messageEl } from "src/newtab/scripts/ui";

export const styleMessage = (textColor: string, font: string) => {
  messageEl.style.color = textColor;

  const messageFontCss = `
.font-message {
  font-family: ${font};
}`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(messageFontCss));
  document.head.appendChild(styleElement);
};
