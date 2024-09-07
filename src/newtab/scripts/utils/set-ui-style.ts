import { Config } from "src/newtab/scripts/config";

export const setUISyle = (ui: Config["ui"]) => {
  // custom css
  const customCss = `${ui.customCSS}`;

  const customCssStyleElement = document.createElement("style");
  customCssStyleElement.type = "text/css";
  customCssStyleElement.appendChild(document.createTextNode(customCss));
  document.head.appendChild(customCssStyleElement);

  // const highlightSyleCss = `
  // ::selection {
  //   background-color: ${ui.highlightColor};
  // }`;

  const highlightSyleCss = `::selection{background-color:${ui.highlightColor};}`;

  const highlightStyleElement = document.createElement("style");
  highlightStyleElement.type = "text/css";
  highlightStyleElement.appendChild(document.createTextNode(highlightSyleCss));
  document.head.appendChild(highlightStyleElement);

  // const uiStyleCss = `
  // .bg-foreground {
  //   background-color: ${ui.foregroundColor};
  // }
  // .bg-background {
  //   background-color: ${ui.backgroundColor};
  // }`;

  if (ui.style === "solid") {
    const uiStyleCss = `.bg-foreground{background-color:${ui.foregroundColor};}.bg-background{background-color:${ui.backgroundColor};}`;

    const uiStyleElement = document.createElement("style");
    uiStyleElement.type = "text/css";
    uiStyleElement.appendChild(document.createTextNode(uiStyleCss));
    document.head.appendChild(uiStyleElement);
  }

  let borderRadius = "0";
  if (ui.cornerStyle === "round") borderRadius = "0.375rem";

  const uiCornerStyleCss = `
  .corner-style {
    border-radius: ${borderRadius} !important;
  }`;

  console.log("TETSET");

  const uiCornerStyleElement = document.createElement("style");
  uiCornerStyleElement.type = "text/css";
  uiCornerStyleElement.appendChild(document.createTextNode(uiCornerStyleCss));
  document.head.appendChild(uiCornerStyleElement);

  document.body.style.transitionDuration = "0ms";
  document.body.classList.add("bg-background");
};
