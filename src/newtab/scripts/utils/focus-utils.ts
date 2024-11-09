export const focusElementBorder = (
  borderEl: HTMLDivElement,
  focusedBorderColor: string,
  e: Event
) => {
  borderEl.classList.remove("border-transparent");
  borderEl.style.borderColor = focusedBorderColor;

  borderEl.focus();
  e.preventDefault();
};

export const unfocusElementBorder = (borderEl: HTMLDivElement) => {
  borderEl.blur();

  borderEl.style.borderColor = "#00000000";
  borderEl.classList.add("border-transparent");
};
