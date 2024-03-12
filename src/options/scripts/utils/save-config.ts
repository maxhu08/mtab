import { getConfig } from "src/newtab/scripts/config";
import { modifyNestedObject } from "src/options/scripts/modify";
import { saveNameToDraft } from "src/options/scripts/utils/save-name";
import { saveTitleToDraft } from "src/options/scripts/utils/save-title";

export const saveConfig = () => {
  getConfig(({ config }) => {
    const draft = modifyNestedObject(config, (draft) => {
      saveTitleToDraft(draft);
      saveNameToDraft(draft);

      return draft;
    });

    chrome.storage.local.set({
      config: draft
    });
  });
};
