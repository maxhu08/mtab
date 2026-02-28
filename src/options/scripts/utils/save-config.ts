import { getConfig } from "~/src/utils/config";
import { modifyNestedObject } from "~/src/utils/modify";

// save helpers
import { saveNameToDraft } from "~/src/options/scripts/utils/save-helpers/save-name";
import { saveTitleSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-title";
import { saveMessageSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-message";
import { saveWallpaperSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-wallpaper";
import { saveAnimationsToDraft } from "~/src/options/scripts/utils/save-helpers/save-animations";
import { saveUISettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-ui";
import { saveSearchSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-search";
import { saveHotkeysSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-hotkeys";
import { saveBookmarksSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-bookmarks";
import { fixAllToggleCheckboxSections } from "~/src/options/scripts/utils/toggle-checkbox";
import {
  searchUseCustomEngineCheckboxEl,
  searchCustomEngineURLInputEl
} from "~/src/options/scripts/ui";
import { saveOptionsSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-options";
import { saveExtrasSettingsToDraft } from "~/src/options/scripts/utils/save-helpers/save-extras";
import { logger } from "~/src/utils/logger";

export const saveConfig = (notify: boolean = true) => {
  if (searchUseCustomEngineCheckboxEl.checked) {
    if (!searchCustomEngineURLInputEl.value.includes("{}")) {
      toast.error("search.customEngineURL must contain {}, aborting save");
      return;
    }
  }

  getConfig(({ config }) => {
    const draft = modifyNestedObject(config, (draft) => {
      saveOptionsSettingsToDraft(draft);

      saveNameToDraft(draft);

      saveTitleSettingsToDraft(draft);

      saveMessageSettingsToDraft(draft);

      saveWallpaperSettingsToDraft(draft);

      saveAnimationsToDraft(draft);

      saveUISettingsToDraft(draft);

      saveSearchSettingsToDraft(draft);

      saveHotkeysSettingsToDraft(draft);

      saveBookmarksSettingsToDraft(draft);

      saveExtrasSettingsToDraft(draft);

      return draft;
    });

    logger.log("[CONFIG_DEBUG]", draft);

    chrome.storage.local
      .set({
        config: draft
      })
      .then(() => {
        if (notify) toast.success("changes saved");
      });

    fixAllToggleCheckboxSections();
  });
};
