import { getConfig } from "src/newtab/scripts/config";
import { modifyNestedObject } from "src/options/scripts/modify";
import { titleInputEl } from "src/options/scripts/ui";

export const saveTitle = (callback: () => void) => {
  const newTitle = titleInputEl.value;

  getConfig(({ config }) => {
    const newConfig = modifyNestedObject(config, (draft) => {
      draft.title = newTitle;

      return draft;
    });

    chrome.storage.local
      .set({
        config: newConfig
      })
      .then(() => callback());
  });
};
