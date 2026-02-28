import { HotkeyInput } from "~/src/options/scripts/ui";
import { focusInput, unfocusInput } from "~/src/options/scripts/utils/ui-helpers";

export const listenToHotkeyInputs = (hotkeyInputs: HotkeyInput[]) => {
  const focusedBorderClass = "border-lime-500";

  hotkeyInputs.forEach((input) => {
    input.input.addEventListener("blur", () =>
      unfocusInput({
        container: input.container,
        input: input.input,
        borderClassOld: focusedBorderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.input.addEventListener("focus", (e) =>
      focusInput({
        container: input.container,
        input: input.input,
        borderClassOld: "border-transparent",
        borderClassNew: focusedBorderClass,
        e
      })
    );

    input.input.addEventListener("input", () => {
      const val = input.input.value;

      if (val === "") {
        input.status.textContent = ` (none)`;
      } else if (val === " ") {
        input.status.textContent = ` (Space)`;
      } else {
        input.status.textContent = ` (${input.input.value})`;
      }
    });
  });
};
