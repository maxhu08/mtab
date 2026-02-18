import { saveConfig } from "src/options/scripts/utils/save-config";
import { saveAndExportConfig } from "src/options/scripts/utils/export-config";
import { importConfigAndSave } from "src/options/scripts/utils/import-config";

export const listenToKeys = () => {
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();

      saveConfig();
    }

    if (e.ctrlKey && e.key === "e") {
      e.preventDefault();

      saveAndExportConfig();
    }

    if (e.ctrlKey && e.key === "i") {
      e.preventDefault();

      void importConfigAndSave();
    }
  });
};
