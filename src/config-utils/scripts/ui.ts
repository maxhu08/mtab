export const convertMTJButtonEl = document.getElementById("convert-mtj-button") as HTMLButtonElement;
export const convertJTMButtonEl = document.getElementById("convert-jtm-button") as HTMLButtonElement;

export const convertInContainerEl = document.getElementById("convert-in-container") as HTMLDivElement;
export const convertInTextareaEl = document.getElementById("convert-in-textarea") as HTMLTextAreaElement;

export const convertOutContainerEl = document.getElementById("convert-out-container") as HTMLDivElement;
export const convertOutTextareaEl = document.getElementById("convert-out-textarea") as HTMLTextAreaElement;

export const convertSaveButtonEl = document.getElementById("convert-save-button") as HTMLButtonElement;

export const buttonSwitches: ButtonSwitch[] = [
  {
    buttons: [convertMTJButtonEl, convertJTMButtonEl],
    attr: "convert-mode"
  }
];

export interface ButtonSwitch {
  buttons: HTMLButtonElement[];
  attr: string;
}

export const inputs: Input[] = [
  {
    container: convertInContainerEl,
    input: convertInTextareaEl
  },
  {
    container: convertOutContainerEl,
    input: convertOutTextareaEl
  }
];

export interface Input {
  container: HTMLDivElement;
  input: HTMLInputElement | HTMLTextAreaElement;
}
