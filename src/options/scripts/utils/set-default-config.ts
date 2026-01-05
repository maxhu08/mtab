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
    toast.success("options reset to default");
  } else {
    toast.info("you selected no, options did not reset");
  }
};
