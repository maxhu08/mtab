import { Config, SnowEnabledType } from "src/newtab/scripts/config";

export const saveExtrasSettingsToDraft = (draft: Config) => {
  // prettier-ignore
  const selectedEnabledEl = document.querySelector(`button[btn-option-type="extras-snow-enabled"][selected="yes"]`) as HTMLButtonElement;
  const extrasSnowEnabledPairs: Record<string, SnowEnabledType> = {
    "extras-snow-enabled-on-button": "on",
    "extras-snow-enabled-winter-button": "winter",
    "extras-snow-enabled-off-button": "off"
  };
  draft.extras.snow.enabled = extrasSnowEnabledPairs[selectedEnabledEl.id];
};
