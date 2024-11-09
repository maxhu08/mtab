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

  if (ui.style === "solid") {
    // .bg-foreground {
    //   background-color: ${ui.foregroundColor};
    // }
    // .bg-background {
    //   background-color: ${ui.backgroundColor};
    // }`;
    insertCss(
      `.bg-foreground{background-color:${ui.foregroundColor};}.bg-background{background-color:${ui.backgroundColor};}`
    );
  } else {
    // .glass-effect {
    //   background-color: ${ui.glassColor};
    //   box-shadow: 0 25px 23px rgba(0, 0, 0, 0.15);
    //   box-sizing: border-box !important;
    //   backdrop-filter: blur(${ui.blurStrength});
    // }
    insertCss(
      `.glass-effect{background-color:${ui.glassColor};box-shadow:0 25px 23px rgba(0,0,0,0.15);box-sizing:border-box!important;backdrop-filter:blur(${ui.blurStrength});}`
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
