import { buttonSwitches, convertSaveButtonEl, inputs, convertMTJButtonEl } from "src/config-utils/scripts/ui";
import { convertSave } from "src/config-utils/scripts/utils/convert";
import { switchButtons } from "src/config-utils/scripts/utils/switch-buttons";

export const handle = () => {
  buttonSwitches.forEach((btnSwitch) => {
    switchButtons(btnSwitch.buttons, btnSwitch.attr);
  });

  convertSaveButtonEl.onclick = () => convertSave();

  const borderClass = "border-blue-500";

  inputs.forEach((input) => {
    input.input.addEventListener("blur", () =>
      unfocusInput({
        container: input.container,
        input: input.input,
        borderClassOld: borderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.input.addEventListener("focus", (e) =>
      focusInput({
        container: input.container,
        input: input.input,
        borderClassOld: "border-transparent",
        borderClassNew: borderClass,
        e
      })
    );
  });

  convertMTJButtonEl.click();
};

export const unfocusInput = ({ container, input, borderClassOld, borderClassNew }: { container: HTMLDivElement; input: HTMLInputElement | HTMLTextAreaElement; borderClassOld: string; borderClassNew: string }) => {
  input.blur();

  container.classList.replace(borderClassOld, borderClassNew);
};

export const focusInput = ({ container, input, borderClassOld, borderClassNew, e }: { container: HTMLDivElement; input: HTMLInputElement | HTMLTextAreaElement; borderClassOld: string; borderClassNew: string; e: Event }) => {
  container.classList.replace(borderClassOld, borderClassNew);

  input.focus();
  e.preventDefault();
};
