import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { saveConfig } from "src/options/scripts/utils/save-config";
import { fixAllToggleCheckboxSections } from "src/options/scripts/utils/toggle-checkbox";
import { defaultConfig } from "src/utils/config";
import { deepMerge } from "src/utils/deep-merge";
import { logger } from "src/utils/logger";
import { migrateOldConfig } from "src/utils/migrate-config";

export const importConfigAndSave = () => {
  const dataToImport = prompt("input your save (THIS WILL OVERWRITE YOUR CURRENT CONFIG)");

  if (dataToImport === null) {
    toast.error("could not import your save");
    return;
  }

  if (dataToImport.trim() === "") {
    toast.info("input was empty, nothing imported");
    return;
  }

  const legacyPrefix = "MTAB_SAVE_FORMAT_";
  const newHeaderRegex = /^MTAB_SAVE_FORMAT_v.+_/;

  if (!dataToImport.startsWith(legacyPrefix)) {
    toast.error(
      `incorrect save format, use MTAB_SAVE_FORMAT_v#.#.#_ or ${legacyPrefix} for legacy saves`
    );
    return;
  }

  // looks like new format but header is invalid
  if (dataToImport.startsWith("MTAB_SAVE_FORMAT_v") && !newHeaderRegex.test(dataToImport)) {
    toast.error("invalid save format, expected MTAB_SAVE_FORMAT_v#.#.#_");
    return;
  }

  let rawPayload: string;

  // new format: MTAB_SAVE_FORMAT_v{version}_{json}
  const versionedMatch = dataToImport.match(/^MTAB_SAVE_FORMAT_v[^_]+_(.+)$/);

  if (dataToImport.startsWith("MTAB_SAVE_FORMAT_v") && !versionedMatch) {
    toast.error("incorrect save format");
    return;
  }

  if (versionedMatch) {
    rawPayload = versionedMatch[1].trim();
  } else {
    // legacy format: base64 + uri + double json
    try {
      rawPayload = JSON.parse(
        decodeURIComponent(window.atob(dataToImport.replace(legacyPrefix, "")))
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
