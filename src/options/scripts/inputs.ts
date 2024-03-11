// import { config } from "src/newtab/scripts/config";
import { inputs } from "./ui";

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

  container.classList.replace("border-orange-500", "border-transparent");
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
  container.classList.replace("border-transparent", "border-orange-500");
  input.focus();
  e.preventDefault();
};
