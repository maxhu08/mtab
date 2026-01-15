import { getConfig } from "src/utils/config";
import { saveConfig } from "src/options/scripts/utils/save-config";

export const saveAndExportConfig = () => {
  // save and don't notify
  saveConfig(false);

  getConfig(({ config }) => {
    const extensionVersion = chrome.runtime.getManifest().version;

    const formattedExportedSave = `MTAB_SAVE_FORMAT_v${extensionVersion}_${JSON.stringify(config)}`;

    navigator.clipboard
      .writeText(formattedExportedSave)
      .then(() => {
        toast.success("config saved & copied to clipboard");
      })
      .catch(() => {
        toast.error("could not save config to clipboard");
      });
  });
};
