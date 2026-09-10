import { saveConfig } from "~/src/options/scripts/utils/save-config";
import { t } from "~/src/options/scripts/i18n";

export const saveAndExportConfig = async () => {
  const config = await saveConfig(false);
  if (!config) return;

  const extensionVersion = chrome.runtime.getManifest().version;
  const formattedExportedSave = `MTAB_SAVE_FORMAT_v${extensionVersion}_${JSON.stringify(config)}`;

  navigator.clipboard
    .writeText(formattedExportedSave)
    .then(() => {
      toast.success(t("config saved & copied to clipboard"));
    })
    .catch(() => {
      toast.error(t("could not save config to clipboard"));
    });
};