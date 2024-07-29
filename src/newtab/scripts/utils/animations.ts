import { Config } from "../config";
import { messageEl, searchContainerEl } from "../ui";

export const addAnimations = (animations: Config["animations"]) => {
  if (!animations.enabled) return;

  const animationCss = `
* {
  transition-duration: 250ms;
}`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(animationCss));
  document.head.appendChild(styleElement);

  messageEl.style.animationDelay = "0ms";
  messageEl.classList.add(animations.type);

  searchContainerEl.style.animationDelay = "50ms";
  searchContainerEl.classList.add(animations.type);

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
