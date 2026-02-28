import { Config } from "~/src/utils/config";
import {
  titleDefaultTitleInputEl,
  titleDynamicEnabledCheckboxEl,
  titleTypewriterRemainCountInputEl,
  titleTypewriterSpeedInputEl
} from "~/src/options/scripts/ui";
import { getSelectedButton } from "~/src/options/scripts/utils/get-selected-button";

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

  const speedValue = Number.parseInt(titleTypewriterSpeedInputEl.value, 10);
  draft.title.typewriter.speed = Number.isNaN(speedValue) ? 500 : Math.max(0, speedValue);

  const remainCountValue = Number.parseInt(titleTypewriterRemainCountInputEl.value, 10);
  draft.title.typewriter.remainCount = Number.isNaN(remainCountValue)
    ? 1
    : Math.max(1, remainCountValue);

  const selectedFaviconTypeEl = getSelectedButton("favicon-type");

  if (selectedFaviconTypeEl) {
    if (selectedFaviconTypeEl.id === "title-favicon-type-default-button") {
      draft.title.faviconType = "default";
    } else if (selectedFaviconTypeEl.id === "title-favicon-type-custom-button") {
      draft.title.faviconType = "custom";
    }
  }
};
