import { getConfig } from "src/newtab/scripts/config";

export const exportConfig = () => {
  getConfig(({ config }) => {
    const exportedSave = JSON.stringify(config);
    const formattedExportedSave = `MTAB_SAVE_FORMAT_${window.btoa(encodeURIComponent(JSON.stringify(exportedSave)))}`;

    navigator.clipboard
      .writeText(formattedExportedSave)
      .then(() => {
        alert("config saved to clipboard (╯✧▽✧)╯");
      })
      .catch((err) => {
        alert("could not config saved to clipboard (>_<)");
      });
  });
};
