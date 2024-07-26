import { AnimationType, BookmarkTiming, Config } from "src/newtab/scripts/config";
import { animationsEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveAnimationsToDraft = (draft: Config) => {
  draft.animations.enabled = animationsEnabledCheckboxEl.checked;

  const selectedBookmarkTimingEl = document.querySelector(
    `button[btn-option-type="animations-bookmark-timing"][selected="yes"]`
  ) as HTMLButtonElement;

  const bookmarkTimingPairs: Record<string, BookmarkTiming> = {
    "animations-bookmark-timing-left-button": "left",
    "animations-bookmark-timing-right-button": "right",
    "animations-bookmark-timing-uniform-button": "uniform"
  };

  draft.animations.bookmarkTiming = bookmarkTimingPairs[selectedBookmarkTimingEl.id];

  const selectedTypeEl = document.querySelector(
    `button[btn-option-type="animations-type"][selected="yes"]`
  ) as HTMLButtonElement;

  const animationsTypePairs: Record<string, AnimationType> = {
    "animations-type-down-bouncy-button": "animate-down-bouncy",
    "animations-type-down-smooth-button": "animate-down-smooth",
    "animations-type-down-fall-button": "animate-down-fall",
    "animations-type-up-bouncy-button": "animate-up-bouncy",
    "animations-type-up-smooth-button": "animate-up-smooth",
    "animations-type-grow-scale-button": "animate-grow-scale",
    "animations-type-fly-left-button": "animate-fly-left",
    "animations-type-fly-right-button": "animate-fly-right"
  };

  draft.animations.type = animationsTypePairs[selectedTypeEl.id];
};
