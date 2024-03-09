import { config, Config } from "src/scripts/config";
import { bookmarksContainerEl, messageEl, searchContainerEl } from "src/scripts/ui";

export const addAnimations = (animations: Config["animations"]) => {
  if (animations.enabled === "off") return;

  messageEl.style.animationDelay = "0ms";
  messageEl.classList.add(animations.animationClass);

  searchContainerEl.style.animationDelay = "50ms";
  searchContainerEl.classList.add(animations.animationClass);
};
