import { Config } from "src/newtab/scripts/config";
import { animationsEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveAnimationsToDraft = (draft: Config) => {
  draft.animations.enabled = animationsEnabledCheckboxEl.checked;

  const selectedEl = document.querySelector(
    `button[btn-option-type="animations-bookmark-timing"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedEl.id) {
    case "animations-bookmark-timing-left-button": {
      draft.animations.bookmarkTiming = "left";
      break;
    }
    case "animations-bookmark-timing-right-button": {
      draft.animations.bookmarkTiming = "right";
      break;
    }
    case "animations-bookmark-timing-uniform-button": {
      draft.animations.bookmarkTiming = "uniform";
      break;
    }
  }
};
