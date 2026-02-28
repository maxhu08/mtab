import { searchInputEl } from "~/src/newtab/scripts/ui";

export const titleTypewriterEffect = (
  text: string,
  titleDynamicEnabled: boolean,
  speed: number,
  remainCount: number
) => {
  let index = 0;
  let direction: "forward" | "backward" = "forward";
  let timeoutId: number | null = null;
  let paused = false;
  const minIndex = Math.max(0, remainCount);

  const tick = () => {
    // pause when search input not empty and dynamic titles are enabled
    if (titleDynamicEnabled && searchInputEl.value.trim() !== "") {
      paused = true;
      timeoutId = null;
      return;
    }

    paused = false;

    if (direction === "forward") {
      index = Math.min(text.length, index + 1);
      document.title = text.slice(0, index);
      if (index === text.length) direction = "backward";
    } else {
      index = Math.max(minIndex, index - 1);
      document.title = text.slice(0, index);
      if (index === minIndex) direction = "forward";
    }

    timeoutId = window.setTimeout(tick, speed);
  };

  // resume when input becomes empty again
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
