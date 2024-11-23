import { oconfig } from "src/options/scripts/oconfig";

export const getContainerAndInput = (baseId: string) => {
  const container = document.getElementById(`${baseId}-container`) as HTMLDivElement;
  const input = document.getElementById(`${baseId}-input`) as HTMLInputElement;

  if (input) {
    input.addEventListener("blur", () =>
      unfocusInput({
        container,
        input,
        borderClassOld: oconfig.inputBorderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.addEventListener("focus", (e) =>
      focusInput({
        container,
        input,
        borderClassOld: "border-transparent",
        borderClassNew: oconfig.inputBorderClass,
        e
      })
    );
  }

  return [container, input] as [HTMLDivElement, HTMLInputElement];
};

export const unfocusInput = ({
  container,
  input,
  borderClassOld,
  borderClassNew
}: {
  container: HTMLDivElement;
  input: HTMLInputElement | HTMLTextAreaElement;
  borderClassOld: string;
  borderClassNew: string;
}) => {
  input.blur();

  container.classList.replace(borderClassOld, borderClassNew);
};

export const focusInput = ({
  container,
  input,
  borderClassOld,
  borderClassNew,
  e
}: {
  container: HTMLDivElement;
  input: HTMLInputElement | HTMLTextAreaElement;
  borderClassOld: string;
  borderClassNew: string;
  e: Event;
}) => {
  container.classList.replace(borderClassOld, borderClassNew);

  input.focus();
  e.preventDefault();
};

export const getCheckbox = (baseId: string) => {
  return document.getElementById(`${baseId}-checkbox`) as HTMLInputElement;
};

export const getButton = (baseId: string) => {
  return document.getElementById(`${baseId}-button`) as HTMLButtonElement;
};
