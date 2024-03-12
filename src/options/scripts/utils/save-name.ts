import { getConfig } from "src/newtab/scripts/config";
import { modifyNestedObject } from "src/options/scripts/modify";
import { usernameInputEl } from "src/options/scripts/ui";

export const saveName = () => {
  const newName = usernameInputEl.value;

  getConfig(({ config }) => {
    const newConfig = modifyNestedObject(config, (draft) => {
      draft.user.name = newName;

      return draft;
    });

    chrome.storage.local.set({
      config: newConfig
    });
  });
};
