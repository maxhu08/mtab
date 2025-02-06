import { Config, SnowEnabledType } from "src/utils/config";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";

export const saveExtrasSettingsToDraft = (draft: Config) => {
  const selectedEnabledEl = getSelectedButton("extras-snow-enabled");
  const extrasSnowEnabledPairs: Record<string, SnowEnabledType> = {
    "extras-snow-enabled-on-button": "on",
    "extras-snow-enabled-winter-button": "winter",
    "extras-snow-enabled-off-button": "off"
  };

  if (selectedEnabledEl) {
    draft.extras.snow.enabled = extrasSnowEnabledPairs[selectedEnabledEl.id];
  }
};
