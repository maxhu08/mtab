import Sortable from "sortablejs";
import tippy, { Instance } from "tippy.js";

export const handleBookmarkNodesDragging = () => {
  // prettier-ignore
  const dropzones = document.querySelectorAll(".bookmarks-user-defined-dropzone") as NodeListOf<HTMLDivElement>;

  dropzones.forEach((dropzone: HTMLDivElement) => {
    // reset the sortable instance
    if (dropzone.dataset.sortableInitialized === "true") {
      // destroy the existing sortable instance (if any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortableInstance = (dropzone as any).sortable;
      if (sortableInstance) {
        sortableInstance.destroy();
      }
    }

    // reinitialize the sortable instance
    new Sortable(dropzone, {
      group: {
        name: "user-defined-bookmark-group",
        pull: true,
        put: true
      },
      fallbackOnBody: true,
      swapThreshold: 0.65,
      invertSwap: false,
      handle: ".bookmark-node-handle",
      animation: 250,
      easing: "cubic-bezier(0.42, 0, 0.58, 1)",
      ghostClass: "bookmark-node-ghost-class",
      chosenClass: "bookmark-node-chosen-class"
    });

    dropzone.dataset.sortableInitialized = "true";
  });
};

let tooltipInstances: Instance[] = [];

export const refreshHandleTooltips = () => {
  // destroy old instances
  tooltipInstances.forEach((instance) => instance.destroy());
  tooltipInstances = [];

  const base = {
    placement: "top" as const,
    theme: "dark",
    animation: "shift-away",
    duration: [120, 90] as [number, number],
    delay: [75, 0] as [number, number]
  };

  tooltipInstances.push(
    // bookmark buttons
    ...tippy(".toggle-collapse-bookmark-button", { ...base, content: "Toggle Collapse Bookmark" }),
    ...tippy(".reposition-bookmark-button", { ...base, content: "Reposition Bookmark" }),
    ...tippy(".delete-bookmark-button", { ...base, content: "Delete Bookmark" }),
    ...tippy(".export-bookmark-button", { ...base, content: "Export Bookmark" }),
    // folder buttons
    ...tippy(".toggle-collapse-folder-button", { ...base, content: "Toggle Collapse Folder" }),
    ...tippy(".reposition-folder-button", { ...base, content: "Reposition Folder" }),
    ...tippy(".delete-folder-button", { ...base, content: "Delete Folder" }),
    ...tippy(".export-folder-button", { ...base, content: "Export Folder" })
  );
};
