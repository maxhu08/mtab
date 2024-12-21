export const collapseOptionSection = (optionSection: HTMLElement) => {
  optionSection.classList.replace("grid", "hidden");
};

export const expandOptionSection = (optionSection: HTMLElement) => {
  optionSection.classList.replace("hidden", "grid");
};

export const bindCollapseOptionButton = (
  collapseButton: HTMLButtonElement,
  optionSection: HTMLElement
) => {
  collapseButton.addEventListener("click", () => {
    if (optionSection.classList.contains("grid")) {
      collapseButton.children[0].className = "ri-expand-horizontal-s-line";
      collapseOptionSection(optionSection);
    } else {
      collapseButton.children[0].className = "ri-collapse-horizontal-line";
      expandOptionSection(optionSection);
    }
  });
};

export const newCollapseGroup = (buttonId: string, sectionId: string) => {
  const collapseButton = document.getElementById(buttonId) as HTMLButtonElement;
  const optionSection = document.getElementById(sectionId) as HTMLElement;

  bindCollapseOptionButton(collapseButton, optionSection);
};
