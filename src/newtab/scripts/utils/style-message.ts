import { FontType } from "src/newtab/scripts/config";
import { messageEl } from "src/newtab/scripts/ui";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const styleMessage = (textColor: string, fontType: FontType, fontCustom: string) => {
  messageEl.style.color = textColor;

  // const messageFontCss = `
  // .font-message {
  //   font-family: ${font};
  // }`;

  if (fontType === "default") {
    const font = '"Jetbrains-Mono-Regular-Fixed"';
    insertCSS(`.font-message{font-family:${font};}`);
  } else {
    console.log("CUSTOM FONT");
  }
};
