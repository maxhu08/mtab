export const listenToggleCheckboxSection = (checkboxId: string, sectionId: string) => {
  const checkboxEl = document.getElementById(checkboxId) as HTMLInputElement;
  const sectionEl = document.getElementById(sectionId) as HTMLDivElement;

  checkboxEl.addEventListener("change", () => {
    if (checkboxEl.checked) {
      sectionEl.classList.remove("hidden");
      sectionEl.classList.add("block");
    } else {
      sectionEl.classList.remove("black");
      sectionEl.classList.add("hidden");
    }
  });
};

export const checkToggleCheckboxSection = (checkboxId: string, sectionId: string) => {
  const checkboxEl = document.getElementById(checkboxId) as HTMLInputElement;
  const sectionEl = document.getElementById(sectionId) as HTMLDivElement;

  if (checkboxEl.checked) {
    sectionEl.classList.remove("hidden");
    sectionEl.classList.add("block");
  } else {
    sectionEl.classList.remove("black");
    sectionEl.classList.add("hidden");
  }
};
