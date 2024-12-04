export const openFolder = (currFolderAreaEl: HTMLDivElement, openfolderAreaEl: HTMLDivElement) => {
  currFolderAreaEl.classList.replace("grid", "hidden");
  openfolderAreaEl.classList.replace("hidden", "grid");
};
