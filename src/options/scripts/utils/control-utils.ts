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

const updateFloatingControlsPosition = () => {
  console.log("Updating floating controls position");

  bottomOfPageSensorEl.style.height = controlsContainerEl.style.height;
  controlsContainerEl.style.bottom = "10px";

  const { left, width } = mainEl.getBoundingClientRect();
  controlsContainerEl.style.left = `${left}px`;
  controlsContainerEl.style.width = `${width}px`;
};

export const handleControls = () => {
  let isIntersecting = false;
  bottomOfPageSensorEl.style.height = controlsContainerEl.style.height;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        controlsContainerEl.style.removeProperty("width");
        controlsContainerEl.style.bottom = "0";
        controlsContainerEl.style.left = "0";
        controlsContainerEl.classList.replace("fixed", "relative");
        controlsContainerEl.classList.remove("drop-shadow");
      } else {
        updateFloatingControlsPosition();
        controlsContainerEl.classList.replace("relative", "fixed");
        controlsContainerEl.classList.add("drop-shadow");
      }
    },
    { rootMargin: "0px", threshold: 0.1 }
  );

  if (bottomOfPageSensorEl) observer.observe(bottomOfPageSensorEl);

  window.addEventListener("resize", () => {
    if (!isIntersecting) {
      updateFloatingControlsPosition();
    }
  });
};
