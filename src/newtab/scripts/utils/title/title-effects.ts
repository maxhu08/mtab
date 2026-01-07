const TITLE_DURATION_MS = 500;

// prevent title from turning into chrome://newtab
const INVISIBLE_TITLE_CHAR = "\u200C";

export const titleTypewriterEffect = (text: string) => {
  let index = 0;
  let direction: "forward" | "backward" = "forward";
  let timeoutId: number | null = null;

  const setTitle = (value: string) => {
    document.title = value.length === 0 ? INVISIBLE_TITLE_CHAR : value;
  };

  const tick = () => {
    if (direction === "forward") {
      index++;
      setTitle(text.slice(0, index));

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
      setTitle(text.slice(0, index));

      if (index === 0) {
        timeoutId = window.setTimeout(() => {
          direction = "forward";
          tick();
        }, TITLE_DURATION_MS);
        return;
      }

      timeoutId = window.setTimeout(tick, TITLE_DURATION_MS);
    }
  };

  tick();

  return () => {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  };
};
