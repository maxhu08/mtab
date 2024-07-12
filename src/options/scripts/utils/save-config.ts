import { getConfig } from "src/newtab/scripts/config";
import { modifyNestedObject } from "src/options/scripts/utils/modify";

// save helpers
import { saveNameToDraft } from "src/options/scripts/utils/save-helpers/save-name";
import { saveTitleSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-title";
import { saveMessageSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-message";
import { saveWallpaperSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-wallpaper";
import { saveAnimationsToDraft } from "src/options/scripts/utils/save-helpers/save-animations";
import { saveUISettingsToDraft } from "src/options/scripts/utils/save-helpers/save-ui";
import { saveSearchSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-search";
import { saveHotkeysSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-hotkeys";
import { saveBookmarksSettingsToDraft } from "src/options/scripts/utils/save-helpers/save-bookmarks";
import { fixAllToggleCheckboxSections } from "src/options/scripts/utils/toggle-checkbox";

import { searchCustomEnabledCheckboxEl, searchCustomEngineInputEl } from "src/options/scripts/ui";

export const saveConfig = () => {
  if (searchCustomEnabledCheckboxEl.checked) {
    if (!searchCustomEngineInputEl.value.includes("{}")) {
      alert("custom search engine URL must contain {}");
      return;
    }
  }

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
      saveUISettingsToDraft(draft);

      // *** search **
      saveSearchSettingsToDraft(draft);

      saveHotkeysSettingsToDraft(draft);

      saveBookmarksSettingsToDraft(draft);

      return draft;
    });

    console.log("[CONFIG_DEBUG]", draft);
    alert("changes saved ☜(･ω･　)");

    chrome.storage.local.set({
      config: draft
    });

    fixAllToggleCheckboxSections();
  });
};
