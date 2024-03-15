import { getConfig } from "src/newtab/scripts/config";
import { modifyNestedObject } from "src/options/scripts/modify";
import { saveAnimationsToDraft } from "src/options/scripts/utils/save-helpers/save-animations";
import { saveDynamicTitleToDraft } from "src/options/scripts/utils/save-helpers/save-dynamic-title";
import { saveNameToDraft } from "src/options/scripts/utils/save-helpers/save-name";
import { saveTitleToDraft } from "src/options/scripts/utils/save-helpers/save-title";
import { saveUiStyleToDraft } from "src/options/scripts/utils/save-helpers/save-ui-style";
import { saveWallpaperSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-wallpaper";

export const saveConfig = () => {
  getConfig(({ config }) => {
    const draft = modifyNestedObject(config, (draft) => {
      saveTitleToDraft(draft);

      saveNameToDraft(draft);

      saveDynamicTitleToDraft(draft);

      saveWallpaperSettingsToDraft(draft);

      saveAnimationsToDraft(draft);

      saveUiStyleToDraft(draft);

      return draft;
    });

    console.log("[CONFIG_DEBUG]", draft);

    chrome.storage.local.set({
      config: draft
    });
  });
};
