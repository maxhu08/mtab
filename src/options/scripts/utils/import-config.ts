import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { fixAllToggleCheckboxSections } from "src/options/scripts/utils/toggle-checkbox";

export const importConfig = () => {
  const dataToImport = prompt("input your save (this will overwrite your current config)");

  if (dataToImport === null) {
    alert("could not import your save");
    return;
  }

  const pattern = `MTAB_SAVE_FORMAT_`;
  if (!dataToImport.startsWith(pattern)) {
    alert(`incorrect save version (use ${pattern})`);
    return;
  }

  const parsedData = JSON.parse(
    JSON.parse(decodeURIComponent(window.atob(dataToImport.replace(pattern, ""))))
  );

  console.log("[IMPORT_DEBUG]", parsedData);
  fillInputs(parsedData);
  fixAllToggleCheckboxSections();
};
