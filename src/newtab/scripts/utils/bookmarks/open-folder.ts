import { AnimationBookmarkType } from "src/newtab/scripts/config";

export const openFolder = (
  currFolderAreaEl: HTMLDivElement,
  openfolderAreaEl: HTMLDivElement,
  animationsEnabled: boolean,
  animationsType: AnimationBookmarkType
) => {
  if (animationsEnabled) {
    currFolderAreaEl.classList.add(animationsType);
    const computedStyle = getComputedStyle(currFolderAreaEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;

    setTimeout(() => {
      currFolderAreaEl.style.opacity = "0%";
    }, animationDuration - 10);

    setTimeout(() => {
      openfolderAreaEl.classList.replace("hidden", "grid");
    }, animationDuration + 20);
  } else {
    openfolderAreaEl.classList.replace("hidden", "grid");
  }
};
