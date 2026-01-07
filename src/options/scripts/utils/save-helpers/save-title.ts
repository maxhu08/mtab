import { Config } from "src/utils/config";
import { titleDefaultTitleInputEl, titleDynamicEnabledCheckboxEl } from "src/options/scripts/ui";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";

export const saveTitleSettingsToDraft = (draft: Config) => {
  draft.title.defaultTitle = titleDefaultTitleInputEl.value;
  draft.title.dynamic.enabled = titleDynamicEnabledCheckboxEl.checked;

  const selectedEffectEl = getSelectedButton("title-effect-type");

  if (selectedEffectEl) {
    if (selectedEffectEl.id === "title-effect-none-button") {
      draft.title.effect = "none";
    } else if (selectedEffectEl.id === "title-effect-typewriter-button") {
      draft.title.effect = "typewriter";
    }
  }

  const selectedFaviconTypeEl = getSelectedButton("favicon-type");

  if (selectedFaviconTypeEl) {
    if (selectedFaviconTypeEl.id === "title-favicon-type-default-button") {
      draft.title.faviconType = "default";
    } else if (selectedFaviconTypeEl.id === "title-favicon-type-custom-button") {
      draft.title.faviconType = "custom";
    }
  }
};
