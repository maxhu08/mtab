import { Config } from "../config";
import { messageEl, searchContainerEl } from "../ui";

export const addAnimations = (animations: Config["animations"]) => {
  if (!animations.enabled) return;

  // Define your CSS rules as plaintext
  const animationCss = `
* {
  transition-duration: 250ms;
}`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(animationCss));
  document.head.appendChild(styleElement);

  console.log(styleElement);

  messageEl.style.animationDelay = "0ms";
  messageEl.classList.add(animations.type);

  searchContainerEl.style.animationDelay = "50ms";
  searchContainerEl.classList.add(animations.type);
};
