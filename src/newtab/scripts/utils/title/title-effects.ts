import { searchInputEl } from "src/newtab/scripts/ui";

const TITLE_DURATION_MS = 500;

export const titleTypewriterEffect = (text: string, titleDynamicEnabled: boolean) => {
  let index = 0;
  let direction: "forward" | "backward" = "forward";
  let timeoutId: number | null = null;
  let paused = false;

  const tick = () => {
    // pause when search input not empty and dynamic titles are enabled
    if (titleDynamicEnabled && searchInputEl.value.trim() !== "") {
      paused = true;
      timeoutId = null;
      return;
    }

    paused = false;

    if (direction === "forward") {
      index++;
      document.title = text.slice(0, index);

      if (index === text.length) {
        timeoutId = window.setTimeout(() => {
          direction = "backward";
          tick();
        }, TITLE_DURATION_MS);
        return;
      }

      timeoutId = window.setTimeout(tick, TITLE_DURATION_MS);
    } else {
      index--;
      document.title = text.slice(0, index);

      if (index <= 1) {
        index = 1;
        timeoutId = window.setTimeout(() => {
          direction = "forward";
          tick();
        }, TITLE_DURATION_MS);
        return;
      }

      timeoutId = window.setTimeout(tick, TITLE_DURATION_MS);
    }
  };

  // Resume when input becomes empty again
  const onInput = () => {
    if (titleDynamicEnabled && paused && searchInputEl.value.trim() === "" && timeoutId === null) {
      tick();
    }
  };

  searchInputEl.addEventListener("input", onInput);

  tick();

  return () => {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
    searchInputEl.removeEventListener("input", onInput);
  };
};
