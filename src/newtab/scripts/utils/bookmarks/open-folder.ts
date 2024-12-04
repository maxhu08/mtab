export const openFolder = (currFolderAreaEl: HTMLDivElement, openfolderAreaEl: HTMLDivElement) => {
  currFolderAreaEl.classList.replace("grid", "hidden");
  currFolderAreaEl.setAttribute("folder-state", "closed");
  openfolderAreaEl.classList.replace("hidden", "grid");
  openfolderAreaEl.setAttribute("folder-state", "open");
};
