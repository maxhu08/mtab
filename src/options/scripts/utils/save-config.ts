import { getConfig } from "src/newtab/scripts/config";
import { modifyNestedObject } from "src/options/scripts/modify";

// save helpers
import { saveNameToDraft } from "src/options/scripts/utils/save-helpers/save-name";
import { saveTitleSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-title";
import { saveMessageSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-message";
import { saveWallpaperSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-wallpaper";
import { saveAnimationsToDraft } from "src/options/scripts/utils/save-helpers/save-animations";
import { saveUiStyleToDraft } from "src/options/scripts/utils/save-helpers/save-ui-style";

export const saveConfig = () => {
  getConfig(({ config }) => {
    const draft = modifyNestedObject(config, (draft) => {
      // *** user ***
      saveNameToDraft(draft);

      // *** title ***
      saveTitleSettingsToDraft(draft);

      // *** message ***
      saveMessageSettingsToDraft(draft);

      // *** wallpaper ***
      saveWallpaperSettingsToDraft(draft);

      // *** animations ***
      saveAnimationsToDraft(draft);

      // *** ui ***
      saveUiStyleToDraft(draft);

      return draft;
    });

    console.log("[CONFIG_DEBUG]", draft);

    chrome.storage.local.set({
      config: draft
    });
  });
};
