export const getContainerAndInput = (baseId: string) => {
  return [
    document.getElementById(`${baseId}-container`),
    document.getElementById(`${baseId}-input`)
  ] as [HTMLDivElement, HTMLInputElement];
};

export const getCheckbox = (baseId: string) => {
  return document.getElementById(`${baseId}-checkbox`) as HTMLInputElement;
};

export const getButton = (baseId: string) => {
  return document.getElementById(`${baseId}-button`) as HTMLButtonElement;
};
