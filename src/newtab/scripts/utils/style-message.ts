import { messageEl } from "src/newtab/scripts/ui";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const styleMessage = (textColor: string, font: string) => {
  messageEl.style.color = textColor;

  // const messageFontCss = `
  // .font-message {
  //   font-family: ${font};
  // }`;

  insertCSS(`.font-message{font-family:${font};}`);
};
