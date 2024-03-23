import { fillInputs } from "src/options/scripts/utils/fill-inputs";

export const importConfig = () => {
  const dataToImport = prompt("input your save (this will overwrite your current config)");

  if (dataToImport === null) {
    alert("could not import your save");
    return;
  }

  const parsedData = JSON.parse(dataToImport);

  fillInputs(parsedData);
};
