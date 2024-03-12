import { Config } from "src/newtab/scripts/config";
import { animationsEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveAnimationsToDraft = (draft: Config) => {
  if (animationsEnabledCheckboxEl.checked) {
    draft.animations.enabled = "on";
  } else {
    draft.animations.enabled = "off";
  }
};
