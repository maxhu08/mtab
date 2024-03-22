import { saveConfig } from "src/options/scripts/utils/save-config";

export const listenToKeys = () => {
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();

      saveConfig();
    }
  });
};
