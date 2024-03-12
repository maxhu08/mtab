import { saveConfig } from "src/options/scripts/utils/save-config";

export const usernameContainerEl = document.getElementById("username-container") as HTMLDivElement;
export const usernameInputEl = document.getElementById("username-input") as HTMLInputElement;
export const titleContainerEl = document.getElementById("title-container") as HTMLDivElement;
export const titleInputEl = document.getElementById("title-input") as HTMLInputElement;
export const animationsEnabledCheckboxEl = document.getElementById(
  "animations-enabled-checkbox"
) as HTMLInputElement;
export const dynamicTitleEnabledCheckbox = document.getElementById(
  "dynamicTitle-enabled-checkbox"
) as HTMLInputElement;

export const inputs: Input[] = [
  {
    container: usernameContainerEl,
    input: usernameInputEl
  },
  {
    container: titleContainerEl,
    input: titleInputEl
  }
];

interface Input {
  container: HTMLDivElement;
  input: HTMLInputElement;
}

const saveBtn = document.getElementById("save-button") as HTMLButtonElement;

saveBtn.onclick = () => {
  saveConfig();
};
