import { AnimationInitialType, UIStyle } from "src/newtab/scripts/config";
import { optionsButtonContainerEl } from "src/newtab/scripts/ui";

export const showOptionsButton = (
  uiStyle: UIStyle,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  textColor: string
) => {
  // prettier-ignore
  optionsButtonContainerEl.innerHTML += `
  <button id="options-button" class="${uiStyle === "glass" ? "glass-effect" : ""} ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""} bg-foreground cursor-pointer corner-style grid place-items-center w-10 h-10 overflow-hidden" style="color: ${textColor}">
    <div class="absolute w-full h-full hover:bg-white/20"></div>
    <i class="ri-equalizer-line text-2xl"></i>
  </button>`;

  const optionsButtonEl = document.getElementById("options-button") as HTMLButtonElement;
  optionsButtonEl.onclick = () => {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
    else window.open(chrome.runtime.getURL("options.html"));
  };

  if (optionsButtonEl && animationsEnabled) {
    const computedStyle = window.getComputedStyle(optionsButtonEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    optionsButtonEl.addEventListener(
      "animationstart",
      () => {
        // Fix weird flickering issue on firefox
        setTimeout(() => {
          optionsButtonEl.classList.remove("opacity-0");
          optionsButtonEl.classList.remove(animationsInitialType);
        }, animationDuration * 0.8); // needs to be less than 1
      },
      {
        once: true
      }
    );

    // Fix button disappearing if user leaves tab too quickly
    document.addEventListener("visibilitychange", () => {
      optionsButtonEl.classList.remove("opacity-0");
    });
  }
};
