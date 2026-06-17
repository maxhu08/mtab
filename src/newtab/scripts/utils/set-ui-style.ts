import { Config } from "~/src/utils/config";
import { insertCSS } from "~/src/newtab/scripts/utils/insert-css";

export const setUISyle = (ui: Config["ui"]) => {
  // custom css
  insertCSS(ui.customCSS, "ui-custom-css");

  // const highlightSyleCss = `
  // ::selection {
  //   background-color: ${ui.highlightColor};
  // }`;

  insertCSS(`::selection{background-color:${ui.highlightColor};}`, "ui-highlight-style");

  if (ui.style === "solid") {
    // .bg-foreground {
    //   background-color: ${ui.foregroundColor};
    // }
    insertCSS(`.bg-foreground{background-color:${ui.foregroundColor};}`, "ui-surface-style");
  } else {
    // .glass-effect {
    //   background-color: ${ui.glassColor};
    //   box-shadow: 0 25px 23px rgba(0, 0, 0, 0.15);
    //   box-sizing: border-box !important;
    //   backdrop-filter: blur(${ui.blurStrength});
    // }
    insertCSS(
      `.glass-effect{background-color:${ui.glassColor};box-shadow:0 25px 23px rgba(0, 0, 0, 0.15);box-sizing:border-box !important;backdrop-filter: blur(${ui.blurStrength})}`,
      "ui-surface-style"
    );
  }

  const borderRadius = ui.cornerStyle === "round" ? "0.375rem" : "0";

  // const uiCornerStyleCss = `
  // .corner-style {
  //   border-radius: ${borderRadius} !important;
  // }`;

  insertCSS(`.corner-style{border-radius:${borderRadius} !important;}`, "ui-corner-style");

  document.body.style.transitionDuration = "0ms";
};