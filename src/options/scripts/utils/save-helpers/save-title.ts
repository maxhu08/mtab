import { Config } from "src/utils/config";
import { titleDefaultTitleInputEl, titleDynamicEnabledCheckboxEl } from "src/options/scripts/ui";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";

export const saveTitleSettingsToDraft = (draft: Config) => {
  draft.title.defaultTitle = titleDefaultTitleInputEl.value;
  draft.title.dynamic.enabled = titleDynamicEnabledCheckboxEl.checked;

  const selectedEl = getSelectedButton("favicon-type");

  if (selectedEl) {
    if (selectedEl.id === "title-favicon-type-default-button") {
      draft.title.faviconType = "default";
    } else if (selectedEl.id === "title-favicon-type-custom-button") {
      draft.title.faviconType = "custom";
    }
  }
};
