import { Config } from "src/newtab/scripts/config";
import { animationsEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveAnimationsToDraft = (draft: Config) => {
  draft.animations.enabled = animationsEnabledCheckboxEl.checked;

  const selectedBookmarkTimingEl = document.querySelector(
    `button[btn-option-type="animations-bookmark-timing"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedBookmarkTimingEl.id) {
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

  const selectedTypeEl = document.querySelector(
    `button[btn-option-type="animations-type"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedTypeEl.id) {
    case "animations-type-down-bouncy-button": {
      draft.animations.type = "animate-down-bouncy";
      break;
    }
    case "animations-type-down-smooth-button": {
      draft.animations.type = "animate-down-smooth";
      break;
    }
    case "animations-type-down-fall-button": {
      draft.animations.type = "animate-down-fall";
      break;
    }
    case "animations-type-up-bouncy-button": {
      draft.animations.type = "animate-up-bouncy";
      break;
    }
    case "animations-type-up-smooth-button": {
      draft.animations.type = "animate-up-smooth";
      break;
    }
    case "animations-type-grow-scale-button": {
      draft.animations.type = "animate-grow-scale";
      break;
    }
    case "animations-type-fly-left-button": {
      draft.animations.type = "animate-fly-left";
      break;
    }
    case "animations-type-fly-right-button": {
      draft.animations.type = "animate-fly-right";
      break;
    }
  }
};
