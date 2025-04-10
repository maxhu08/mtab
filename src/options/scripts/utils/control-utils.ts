// prettier-ignore
const controlsContainerPlaceholderEl = document.getElementById("controls-container-placeholder") as HTMLDivElement;
const controlsContainerEl = document.getElementById("controls-container") as HTMLDivElement;
const bottomOfPageSensorEl = document.getElementById("bottom-of-page-sensor") as HTMLDivElement;
const mainEl = document.querySelector("main") as HTMLElement;

export const showControls = () => {
  const { left, width } = mainEl.getBoundingClientRect();
  controlsContainerEl.style.left = `${left}px`;
  controlsContainerEl.style.width = `${width}px`;

  controlsContainerEl.classList.remove("hidden");
};

const updateFloatingControlsPosition = () => {
  const { height } = controlsContainerEl.getBoundingClientRect();
  controlsContainerPlaceholderEl.style.height = `${height}px`;

  controlsContainerEl.style.bottom = "10px";
  const { left, width } = mainEl.getBoundingClientRect();
  controlsContainerEl.style.left = `${left}px`;
  controlsContainerEl.style.width = `${width}px`;
};

export const handleControls = () => {
  let isIntersecting = false;
  controlsContainerPlaceholderEl.style.height = controlsContainerEl.style.height;

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
    { rootMargin: "0px", threshold: 1 }
  );

  if (bottomOfPageSensorEl) observer.observe(bottomOfPageSensorEl);

  window.addEventListener("resize", () => {
    if (!isIntersecting) {
      updateFloatingControlsPosition();

      setTimeout(() => {
        updateFloatingControlsPosition();
      }, 500);
    }
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY === 0) {
      controlsContainerEl.classList.remove("falling-up");
      controlsContainerEl.classList.add("falling-down");
    } else {
      controlsContainerEl.classList.remove("falling-down");
      controlsContainerEl.classList.add("falling-up");

      if (!isIntersecting) {
        showControls();
      }
    }
  });
};
