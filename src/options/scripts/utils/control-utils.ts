const controlsContainerEl = document.getElementById("controls-container") as HTMLDivElement;
const mainEl = document.querySelector("main") as HTMLElement;
const bottomOfPageSensorEl = document.getElementById("bottom-of-page-sensor") as HTMLDivElement;

export const showControls = () => {
  if (mainEl) {
    const { left, width } = mainEl.getBoundingClientRect();
    controlsContainerEl.style.left = `${left}px`;
    controlsContainerEl.style.width = `${width}px`;
  }

  controlsContainerEl.classList.remove("hidden");
};

export const handleControls = () => {
  bottomOfPageSensorEl.style.height = "120px";

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        controlsContainerEl.style.position = "relative";
        controlsContainerEl.style.bottom = "0";
        controlsContainerEl.style.left = "0";
      } else {
        const { left, width } = mainEl.getBoundingClientRect();
        controlsContainerEl.style.position = "fixed";
        controlsContainerEl.style.bottom = "10px";
        controlsContainerEl.style.left = `${left}px`;
        controlsContainerEl.style.width = `${width}px`;
      }
    },
    { rootMargin: "0px", threshold: 0.1 }
  );

  if (bottomOfPageSensorEl) observer.observe(bottomOfPageSensorEl);
};
