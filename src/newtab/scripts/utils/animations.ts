import { insertCSS } from "src/newtab/scripts/utils/insert-css";
import { Config } from "../config";
import { messageEl, searchContainerEl } from "../ui";

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
    const computedStyle = window.getComputedStyle(searchContainerEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    searchContainerEl.addEventListener(
      "animationstart",
      () => {
        // Fix weird flickering issue on firefox
        setTimeout(() => {
          searchContainerEl.classList.remove("opacity-0");
        }, animationDuration - 500);
      },
      {
        once: true
      }
    );

    // Fix bookmarks disappearing if user leaves tab too quickly
    document.addEventListener("visibilitychange", () => {
      searchContainerEl.classList.remove("opacity-0");
    });
  }
};
