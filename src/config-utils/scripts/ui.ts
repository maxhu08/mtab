export const modeMTJButtonEl = document.getElementById("mode-mtj-button") as HTMLButtonElement;
export const modeJTMButtonEl = document.getElementById("mode-jtm-button") as HTMLButtonElement;

export const modeInContainerEl = document.getElementById("mode-in-container") as HTMLDivElement;
export const modeInTextareaEl = document.getElementById("mode-in-textarea") as HTMLTextAreaElement;

export const modeOutContainerEl = document.getElementById("mode-out-container") as HTMLDivElement;
export const modeOutTextareaEl = document.getElementById("mode-out-textarea") as HTMLTextAreaElement;

export const buttonSwitches: ButtonSwitch[] = [
  {
    buttons: [modeMTJButtonEl, modeJTMButtonEl],
    attr: "ui-style"
  }
];

export interface ButtonSwitch {
  buttons: HTMLButtonElement[];
  attr: string;
}

export const inputs: Input[] = [
  {
    container: modeInContainerEl,
    input: modeInTextareaEl,
  },
  {
    container: modeOutContainerEl,
    input: modeOutTextareaEl,
  }
];

export interface Input {
  container: HTMLDivElement;
  input: HTMLInputElement | HTMLTextAreaElement;
}