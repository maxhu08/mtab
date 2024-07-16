import { Config } from "src/newtab/scripts/config";

export const setUISyle = (ui: Config["ui"]) => {
  // custom css
  const customCss = `${ui.customCSS}`;

  const customCssStyleElement = document.createElement("style");
  customCssStyleElement.type = "text/css";
  customCssStyleElement.appendChild(document.createTextNode(customCss));
  document.head.appendChild(customCssStyleElement);

  const highlightSyleCss = `
::selection {
  background-color: ${ui.highlightColor};
}`;

  const highlightStyleElement = document.createElement("style");
  highlightStyleElement.type = "text/css";
  highlightStyleElement.appendChild(document.createTextNode(highlightSyleCss));
  document.head.appendChild(highlightStyleElement);

  if (ui.style !== "solid") return;

  const uiStyleCss = `
.bg-foreground {
  background-color: ${ui.foregroundColor};
}
.bg-background {
  background-color: ${ui.backgroundColor};
}`;

  const uiStyleElement = document.createElement("style");
  uiStyleElement.type = "text/css";
  uiStyleElement.appendChild(document.createTextNode(uiStyleCss));
  document.head.appendChild(uiStyleElement);

  document.body.style.transitionDuration = "0ms";
  document.body.classList.add("bg-background");
};
