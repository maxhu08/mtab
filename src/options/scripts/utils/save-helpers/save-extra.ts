import { Config, SnowEnabledType } from "src/newtab/scripts/config";

export const saveExtraSettingsToDraft = (draft: Config) => {
  // prettier-ignore
  const selectedEnabledEl = document.querySelector(`button[btn-option-type="extra-snow-enabled"][selected="yes"]`) as HTMLButtonElement;
  const extraSnowEnabledPairs: Record<string, SnowEnabledType> = {
    "extra-snow-enabled-on-button": "on",
    "extra-snow-enabled-winter-button": "winter",
    "extra-snow-enabled-off-button": "off"
  };
  draft.extra.snow.enabled = extraSnowEnabledPairs[selectedEnabledEl.id];
};
