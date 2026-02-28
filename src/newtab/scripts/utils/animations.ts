import { insertCSS } from "~/src/newtab/scripts/utils/insert-css";
import { Config } from "~/src/utils/config";
import { messageEl, searchContainerEl } from "~/src/newtab/scripts/ui";
import { handleAnimation } from "~/src/newtab/scripts/utils/animations/handle-animation";

export const addAnimations = (animations: Config["animations"]) => {
  if (!animations.enabled) {
    searchContainerEl.classList.remove("opacity-0");
    return;
  }

  // const animationCss = `
  // * {
  //   transition-duration: 250ms;
  // }`;

  insertCSS(`*{transition-duration:250ms;}`);

  messageEl.style.animationDelay = "0ms";
  messageEl.classList.add(animations.initialType);

  searchContainerEl.style.animationDelay = "50ms";
  searchContainerEl.classList.add(animations.initialType);

  if (animations.enabled) {
    handleAnimation(searchContainerEl, animations.initialType);
  }
};
