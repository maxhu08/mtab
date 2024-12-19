export const handleAnimation = (el: HTMLElement, animationsClass: string) => {
  const computedStyle = window.getComputedStyle(el);
  const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;

  el.addEventListener(
    "animationstart",
    () => {
      setTimeout(() => {
        el.classList.remove("opacity-0");
        el.classList.remove(animationsClass);
      }, animationDuration * 0.8);
    },
    { once: true }
  );

  document.addEventListener("visibilitychange", () => {
    el.classList.remove("opacity-0");
  });
};
