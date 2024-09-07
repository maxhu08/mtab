import { Config } from "src/newtab/scripts/config";
import { insertCss } from "src/newtab/scripts/utils/insert-css";

export const setUISyle = (ui: Config["ui"]) => {
  // custom css
  insertCss(ui.customCSS);

  // const highlightSyleCss = `
  // ::selection {
  //   background-color: ${ui.highlightColor};
  // }`;

  insertCss(`::selection{background-color:${ui.highlightColor};}`);

  // const uiStyleCss = `
  // .bg-foreground {
  //   background-color: ${ui.foregroundColor};
  // }
  // .bg-background {
  //   background-color: ${ui.backgroundColor};
  // }`;

  if (ui.style === "solid") {
    insertCss(
      `.bg-foreground{background-color:${ui.foregroundColor};}.bg-background{background-color:${ui.backgroundColor};}`
    );
  }

  let borderRadius = "0";
  if (ui.cornerStyle === "round") borderRadius = "0.375rem";

  // const uiCornerStyleCss = `
  // .corner-style {
  //   border-radius: ${borderRadius} !important;
  // }`;

  insertCss(`.corner-style{border-radius:${borderRadius} !important;}`);

  document.body.style.transitionDuration = "0ms";
  document.body.classList.add("bg-background");
};
