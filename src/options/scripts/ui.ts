const usernameContainerEl = document.getElementById("username-container") as HTMLDivElement;
const usernameInputEl = document.getElementById("username-input") as HTMLInputElement;

export const inputs: Input[] = [
  {
    container: usernameContainerEl,
    input: usernameInputEl
  }
];

interface Input {
  container: HTMLDivElement;
  input: HTMLInputElement;
}
