import { FontType } from "src/newtab/scripts/config";
import { messageEl } from "src/newtab/scripts/ui";
import { getFontNameFromURL } from "src/newtab/scripts/utils/get-font-name";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const styleMessage = (
  textColor: string,
  textSize: number,
  fontType: FontType,
  fontCustom: string
) => {
  messageEl.style.color = textColor;

  // .text-size-message {
  //   font-size: ${textSize * 0.4}rem;
  // }
  // @media (min-width: 768px) {
  //   .text-size-message {
  //     font-size: ${textSize * 0.75}rem;
  //   }
  // }
  // @media (min-width: 1024px) {
  //   .text-size-message {
  //     font-size: ${textSize}rem;
  //   }
  // }

  insertCSS(
    `.text-size-message{font-size:${textSize * 0.4}rem}@media (min-width: 768px){.text-size-message{font-size:${textSize * 0.75}rem}}@media (min-width: 1024px){.text-size-message{font-size:${textSize}rem}}`
  );

  // const messageFontCss = `
  // .font-message {
  //   font-family: ${font};
  // }`;

  if (fontType === "default") {
    const font = '"Jetbrains-Mono-Regular-Fixed"';
    insertCSS(`.font-message{font-family:${font};}`);
  } else {
    // @import url('${fontCustom}');
    // .font-message {
    //   font-family: "${fontName}", serif !important;
    //   font-style: normal;
    // }

    const fontName = getFontNameFromURL(fontCustom);
    insertCSS(
      `@import url("${fontCustom}");.font-message{font-family:"${fontName}",sans-serif!important;font-style:normal;}`
    );
  }
};
