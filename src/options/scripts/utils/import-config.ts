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

  if (dataToImport.trim() === "") {
    toast.info("input was empty, nothing imported");
    return;
  }

  const basePrefix = "MTAB_SAVE_FORMAT_";
  if (!dataToImport.startsWith(basePrefix)) {
    toast.error(
      `incorrect save format, use MTAB_SAVE_FORMAT_v#.#.#_ or ${basePrefix} for legacy saves`
    );
    return;
  }

  let rawPayload: string;

  // new format: MTAB_SAVE_FORMAT_v-{version}_{json}
  const versionedMatch = dataToImport.match(/^MTAB_SAVE_FORMAT_v[^_]+_(.+)$/);

  if (versionedMatch) {
    // new format: plain json after version
    rawPayload = versionedMatch[1];
  } else {
    // legacy format: base64 + uri + double json
    try {
      rawPayload = JSON.parse(
        decodeURIComponent(window.atob(dataToImport.replace(basePrefix, "")))
      );
    } catch {
      toast.error("failed to parse legacy save format");
      return;
    }
  }

  let importedConfig;
  try {
    importedConfig = JSON.parse(rawPayload);
  } catch {
    toast.error("invalid config data");
    return;
  }

  const mergedConfig = deepMerge(structuredClone(defaultConfig), importedConfig);
  const finalizedConfig = migrateOldConfig(mergedConfig);

  logger.log("[IMPORT_DEBUG]", finalizedConfig);
  fillInputs(finalizedConfig);
  fixAllToggleCheckboxSections();

  saveConfig();
};
