import { defaultConfig } from "~/src/utils/config";
import { fillInputs } from "~/src/options/scripts/utils/fill-inputs";
import { saveConfig } from "~/src/options/scripts/utils/save-config";
import { showActionDialog } from "~/src/options/scripts/utils/input-dialog";
import { logger } from "~/src/utils/logger";
import { t } from "~/src/options/scripts/i18n";

export const setDefaultConfig = () => {
  void showActionDialog(t("do you want to reset your options to default? this cannot be undone."), {
    cancelText: t("cancel"),
    actionText: t("reset"),
    onAction: async () => {
      const clonedDefaultConfig = structuredClone(defaultConfig);
      logger.log("[RESET_DEBUG]", clonedDefaultConfig);
      fillInputs(clonedDefaultConfig);
      saveConfig(false);
      toast.success(t("options reset to default"));
    }
  }).then((confirmed) => {
    if (!confirmed) {
      toast.info(t("you selected no, options did not reset"));
    }
  });
};