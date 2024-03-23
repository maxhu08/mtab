import { Config } from "src/newtab/scripts/config";

export const setUISyle = (ui: Config["ui"]) => {
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

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(uiStyleCss));
  document.head.appendChild(styleElement);

  document.body.style.transitionDuration = "0ms";
  document.body.classList.add("bg-background");
};
