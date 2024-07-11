const checkboxSections = [
  ["wallpaper-enabled-checkbox", "wallpaper-enabled-section"],
  ["animations-enabled-checkbox", "animations-enabled-section"],
  ["search-enabled-checkbox", "search-enabled-section"],
  ["hotkeys-enabled-checkbox", "hotkeys-enabled-section"]
];

export const listenAllToggleCheckboxSections = () => {
  for (let i = 0; i < checkboxSections.length; i++) {
    listenToggleCheckboxSection(checkboxSections[i][0], checkboxSections[i][1]);
  }
};

export const fixAllToggleCheckboxSections = () => {
  for (let i = 0; i < checkboxSections.length; i++) {
    fixToggleCheckboxSection(checkboxSections[i][0], checkboxSections[i][1]);
  }
};

const listenToggleCheckboxSection = (checkboxId: string, sectionId: string) => {
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

const fixToggleCheckboxSection = (checkboxId: string, sectionId: string) => {
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
