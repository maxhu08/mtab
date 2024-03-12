import { getConfig } from "src/newtab/scripts/config";
import { modifyNestedObject } from "src/options/scripts/modify";
import { saveAnimationsToDraft } from "src/options/scripts/utils/save-animations";
import { saveNameToDraft } from "src/options/scripts/utils/save-name";
import { saveTitleToDraft } from "src/options/scripts/utils/save-title";

export const saveConfig = () => {
  getConfig(({ config }) => {
    const draft = modifyNestedObject(config, (draft) => {
      saveTitleToDraft(draft);
      saveNameToDraft(draft);
      saveAnimationsToDraft(draft);

      return draft;
    });

    console.log("[CONFIG_DEBUG]", draft);

    chrome.storage.local.set({
      config: draft
    });
  });
};
