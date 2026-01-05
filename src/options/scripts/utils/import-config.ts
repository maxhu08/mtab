import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { saveConfig } from "src/options/scripts/utils/save-config";
import { fixAllToggleCheckboxSections } from "src/options/scripts/utils/toggle-checkbox";
import { defaultConfig } from "src/utils/config";
import { deepMerge } from "src/utils/deep-merge";
import { logger } from "src/utils/logger";
import { migrateOldConfig } from "src/utils/migrate-config";

export const importConfigAndSave = () => {
  const dataToImport = prompt("input your save (this will overwrite your current config)");

  if (dataToImport === null) {
    toast.error("could not import your save");
    return;
  }

  const pattern = `MTAB_SAVE_FORMAT_`;
  if (!dataToImport.startsWith(pattern)) {
    toast.error(`incorrect save version (use ${pattern})`);
    return;
  }

  const importedConfig = JSON.parse(
    JSON.parse(decodeURIComponent(window.atob(dataToImport.replace(pattern, ""))))
  );

  const mergedConfig = deepMerge(structuredClone(defaultConfig), importedConfig);
  const finalizedConfig = migrateOldConfig(mergedConfig);

  logger.log("[IMPORT_DEBUG]", finalizedConfig);
  fillInputs(finalizedConfig);
  fixAllToggleCheckboxSections();

  saveConfig();
};
