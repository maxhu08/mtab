import { Config } from "src/utils/config";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const setUISyle = (ui: Config["ui"]) => {
  // custom css
  insertCSS(ui.customCSS);

  // const highlightSyleCss = `
  // ::selection {
  //   background-color: ${ui.highlightColor};
  // }`;

  insertCSS(`::selection{background-color:${ui.highlightColor};}`);

  if (ui.style === "solid") {
    // .bg-foreground {
    //   background-color: ${ui.foregroundColor};
    // }
    // .bg-background {
    //   background-color: ${ui.backgroundColor};
    // }`;
    insertCSS(
      `.bg-foreground{background-color:${ui.foregroundColor};}.bg-background{background-color:${ui.backgroundColor};}`
    );
  } else {
    // .glass-effect {
    //   background-color: ${ui.glassColor};
    //   box-shadow: 0 25px 23px rgba(0, 0, 0, 0.15);
    //   box-sizing: border-box !important;
    //   backdrop-filter: blur(${ui.blurStrength});
    // }
    // .bg-background {
    //   background-color: ${ui.backgroundColor};
    // }`;
    insertCSS(
      `.glass-effect{background-color:${ui.glassColor};box-shadow:0 25px 23px rgba(0, 0, 0, 0.15);box-sizing:border-box !important;backdrop-filter: blur(${ui.blurStrength})}.bg-background{background-color:${ui.backgroundColor}}`
    );
  }

  let borderRadius = "0";
  if (ui.cornerStyle === "round") borderRadius = "0.375rem";

  // const uiCornerStyleCss = `
  // .corner-style {
  //   border-radius: ${borderRadius} !important;
  // }`;

  insertCSS(`.corner-style{border-radius:${borderRadius} !important;}`);

  document.body.style.transitionDuration = "0ms";
  document.body.classList.add("bg-background");
};
