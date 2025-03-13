import Sortable from "sortablejs";

export const fillCollectionWallpaper = () => {
  handleWallpaperCollectionsDragging();
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
      pull: true,
      put: true
    },
    fallbackOnBody: true,
    swapThreshold: 0.65,
    handle: ".wallpaper-collection-node-handle",
    animation: 250,
    easing: "cubic-bezier(0.42, 0, 0.58, 1)",
    ghostClass: "draggable-item-ghost-class",
    chosenClass: "draggable-item-chosen-class"
  });
};
