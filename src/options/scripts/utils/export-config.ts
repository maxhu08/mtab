import { getConfig } from "src/utils/config";
import { saveConfig } from "src/options/scripts/utils/save-config";

export const saveAndExportConfig = () => {
  // save and don't notify
  saveConfig(false);

  getConfig(({ config }) => {
    const exportedSave = JSON.stringify(config);
    const formattedExportedSave = `MTAB_SAVE_FORMAT_${window.btoa(encodeURIComponent(JSON.stringify(exportedSave)))}`;

    navigator.clipboard
      .writeText(formattedExportedSave)
      .then(() => {
        alert("config saved & copied to clipboard (╯✧▽✧)╯");
      })
      .catch((err) => {
        alert("could not config saved to clipboard (>_<)");
      });
  });
};
