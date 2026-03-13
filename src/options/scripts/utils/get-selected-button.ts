export const getSelectedButton = (btnOptionType: string): HTMLButtonElement => {
  return document.querySelector(
    `button[btn-option-type="${btnOptionType}"][aria-pressed="true"]`
  ) as HTMLButtonElement;
};