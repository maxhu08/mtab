// prettier-ignore
const controlsContainerPlaceholderEl = document.getElementById("controls-container-placeholder") as HTMLDivElement;
const controlsContainerEl = document.getElementById("controls-container") as HTMLDivElement;
const mainEl = document.querySelector("main") as HTMLElement;
const FLOATING_BOTTOM_OFFSET_PX = 10;

const measureControlsHeight = () => {
  const currentHeight = controlsContainerEl.getBoundingClientRect().height;
  if (currentHeight > 0) return currentHeight;

  const wasHidden = controlsContainerEl.classList.contains("hidden");
  const previousVisibility = controlsContainerEl.style.visibility;
  const previousPointerEvents = controlsContainerEl.style.pointerEvents;
  const previousTransform = controlsContainerEl.style.transform;
  const previousOpacity = controlsContainerEl.style.opacity;

  if (wasHidden) controlsContainerEl.classList.remove("hidden");
  controlsContainerEl.style.visibility = "hidden";
  controlsContainerEl.style.pointerEvents = "none";
  controlsContainerEl.style.removeProperty("transform");
  controlsContainerEl.style.removeProperty("opacity");

  const measuredHeight = controlsContainerEl.getBoundingClientRect().height;

  if (wasHidden) controlsContainerEl.classList.add("hidden");
  controlsContainerEl.style.visibility = previousVisibility;
  controlsContainerEl.style.pointerEvents = previousPointerEvents;
  controlsContainerEl.style.transform = previousTransform;
  controlsContainerEl.style.opacity = previousOpacity;

  return measuredHeight;
};

const reserveControlsPlaceholderHeight = () => {
  const height = measureControlsHeight();
  if (height > 0) {
    controlsContainerPlaceholderEl.style.height = `${height}px`;
    controlsContainerPlaceholderEl.style.minHeight = `${height}px`;
  }
};

const resetFloatingControlsAnimationState = () => {
  controlsContainerEl.classList.remove("falling-up", "falling-down");
  controlsContainerEl.style.removeProperty("transform");
  controlsContainerEl.style.removeProperty("opacity");
};

export const showControls = () => {
  const { left, width } = mainEl.getBoundingClientRect();
  controlsContainerEl.style.left = `${left}px`;
  controlsContainerEl.style.width = `${width}px`;

  controlsContainerEl.classList.remove("hidden");
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
      resetFloatingControlsAnimationState();
      controlsContainerEl.style.removeProperty("width");
      controlsContainerEl.style.bottom = "0";
      controlsContainerEl.style.left = "0";
      controlsContainerEl.classList.replace("fixed", "relative");
      controlsContainerEl.classList.remove("drop-shadow");
    } else {
      updateFloatingControlsPosition();
      resetFloatingControlsAnimationState();
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
      controlsContainerEl.classList.remove("falling-up");
      controlsContainerEl.classList.add("falling-down");
      return;
    }

    showControls();
    syncControlsDockState();

    if (isDocked) {
      resetFloatingControlsAnimationState();
      return;
    }

    // Keep controls visible immediately while scrolling (no hidden->visible animation flicker).
    resetFloatingControlsAnimationState();
  });

  syncControlsDockState();
};
