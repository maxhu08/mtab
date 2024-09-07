import { messageEl } from "src/newtab/scripts/ui";
import { insertCss } from "src/newtab/scripts/utils/insert-css";

export const styleMessage = (textColor: string, font: string) => {
  messageEl.style.color = textColor;

  // const messageFontCss = `
  // .font-message {
  //   font-family: ${font};
  // }`;

  insertCss(`.font-message{font-family:${font};}`);
};
