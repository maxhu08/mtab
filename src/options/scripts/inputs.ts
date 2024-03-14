import { oconfig } from "src/options/scripts/oconfig";
import { inputs, uiStyleGlassButtonEl, uiStyleSolidButtonEl } from "./ui";
import { switchButtons } from "src/options/scripts/utils/switch-buttons";

inputs.forEach((input) => {
  input.input.addEventListener("blur", () =>
    unfocusInput({
      container: input.container,
      input: input.input
    })
  );

  input.input.addEventListener("focus", (e) =>
    focusInput({
      input: input.input,
      container: input.container,
      e
    })
  );
});

const unfocusInput = ({
  container,
  input
}: {
  container: HTMLDivElement;
  input: HTMLInputElement;
}) => {
  input.blur();

  container.classList.replace(oconfig.inputBorderClass, "border-transparent");
};

const focusInput = ({
  container,
  input,
  e
}: {
  container: HTMLDivElement;
  input: HTMLInputElement;
  e: Event;
}) => {
  container.classList.replace("border-transparent", oconfig.inputBorderClass);
  input.focus();
  e.preventDefault();
};

switchButtons([uiStyleSolidButtonEl, uiStyleGlassButtonEl]);
