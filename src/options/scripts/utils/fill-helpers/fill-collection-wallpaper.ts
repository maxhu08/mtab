import Sortable from "sortablejs";

export const fillCollectionWallpaper = () => {
  console.log("test");
};

export const handleWallpaperCollectionsDragging = () => {
  const dropzone = document.querySelector(".wallpaper-collections-dropzone") as HTMLDivElement;

  // Reset the sortable instance
  if (dropzone.dataset.sortableInitialized === "true") {
    // Destroy the existing sortable instance (if any)
    const sortableInstance = (dropzone as any).sortable;
    if (sortableInstance) {
      sortableInstance.destroy();
    }
  }

  // Reinitialize the sortable instance
  new Sortable(dropzone, {
    group: {
      name: "collection-wallpaper-group",
      pull: false, // needs to be false to prevent dragging to bookmarks
      put: false // needs to be false to prevent dragging to bookmarks
    },
    fallbackOnBody: true,
    swapThreshold: 0.65,
    handle: ".wallpaper-collection-node-handle",
    animation: 0,
    easing: "cubic-bezier(0.42, 0, 0.58, 1)",
    ghostClass: "draggable-item-ghost-class",
    chosenClass: "draggable-item-chosen-class"
  });

  dropzone.dataset.sortableInitialized = "true";
};
