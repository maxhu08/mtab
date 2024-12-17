import { deepMerge, defaultConfig } from "src/newtab/scripts/config";
import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { saveConfig } from "src/options/scripts/utils/save-config";
import { fixAllToggleCheckboxSections } from "src/options/scripts/utils/toggle-checkbox";

export const importConfigAndSave = () => {
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

  const importedConfig = JSON.parse(
    JSON.parse(decodeURIComponent(window.atob(dataToImport.replace(pattern, ""))))
  );

  const mergedConfig = deepMerge(structuredClone(defaultConfig), importedConfig);

  console.log("[IMPORT_DEBUG]", mergedConfig);
  fillInputs(mergedConfig);
  fixAllToggleCheckboxSections();

  saveConfig();
};
