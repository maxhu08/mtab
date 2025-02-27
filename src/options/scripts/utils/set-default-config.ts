import { defaultConfig } from "src/utils/config";
import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { saveConfig } from "src/options/scripts/utils/save-config";
import { logger } from "src/utils/logger";

export const setDefaultConfig = () => {
  const confirmReset = window.confirm("do you want to reset your options to default?");

  if (confirmReset) {
    const clonedDefaultConfig = structuredClone(defaultConfig);
    logger.log("[RESET_DEBUG]", clonedDefaultConfig);
    fillInputs(clonedDefaultConfig);
    saveConfig(false);
    alert("options reset to default");
  } else {
    alert("you selected no, options did not reset");
  }
};
