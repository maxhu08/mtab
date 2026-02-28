// prettier-ignore
const controlsContainerPlaceholderEl = document.getElementById("controls-container-placeholder") as HTMLDivElement;
const controlsContainerEl = document.getElementById("controls-container") as HTMLDivElement;
const mainEl = document.querySelector("main") as HTMLElement;
const FLOATING_BOTTOM_OFFSET_PX = 10;

const measureControlsHeight = () => {
  return controlsContainerEl.getBoundingClientRect().height;
};

const reserveControlsPlaceholderHeight = () => {
  const height = measureControlsHeight();
  if (height > 0) {
    controlsContainerPlaceholderEl.style.height = `${height}px`;
    controlsContainerPlaceholderEl.style.minHeight = `${height}px`;
  }
};

const setControlsVisibility = (isVisible: boolean) => {
  controlsContainerEl.classList.toggle("controls-hidden", !isVisible);
};

export const showControls = () => {
  const { left, width } = mainEl.getBoundingClientRect();
  controlsContainerEl.style.left = `${left}px`;
  controlsContainerEl.style.width = `${width}px`;

  setControlsVisibility(true);
};

const updateFloatingControlsPosition = () => {
  const height = measureControlsHeight();
  controlsContainerPlaceholderEl.style.height = `${height}px`;

  controlsContainerEl.style.bottom = `${FLOATING_BOTTOM_OFFSET_PX}px`;
  const { left, width } = mainEl.getBoundingClientRect();
  controlsContainerEl.style.left = `${left}px`;
  controlsContainerEl.style.width = `${width}px`;
};

export const handleControls = () => {
  let isDocked = false;
  reserveControlsPlaceholderHeight();

  const syncControlsDockState = () => {
    const height = measureControlsHeight();
    controlsContainerPlaceholderEl.style.height = `${height}px`;

    const placeholderTop = controlsContainerPlaceholderEl.getBoundingClientRect().top;
    const dockThreshold = window.innerHeight - height - FLOATING_BOTTOM_OFFSET_PX;
    const shouldDock = placeholderTop <= dockThreshold;

    if (shouldDock) {
      controlsContainerEl.style.removeProperty("width");
      controlsContainerEl.style.removeProperty("bottom");
      controlsContainerEl.style.removeProperty("left");
      controlsContainerEl.classList.replace("fixed", "relative");
      controlsContainerEl.classList.remove("drop-shadow");
      setControlsVisibility(true);
    } else {
      updateFloatingControlsPosition();
      controlsContainerEl.classList.replace("relative", "fixed");
      controlsContainerEl.classList.add("drop-shadow");
    }

    isDocked = shouldDock;
  };

  window.addEventListener("resize", () => {
    syncControlsDockState();

    if (!isDocked) {
      updateFloatingControlsPosition();

      setTimeout(() => {
        updateFloatingControlsPosition();
      }, 500);
    }
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY === 0) {
      syncControlsDockState();

      if (!isDocked) {
        setControlsVisibility(false);
      }

      return;
    }

    syncControlsDockState();

    if (isDocked) {
      return;
    }

    showControls();
  });

  syncControlsDockState();
};
