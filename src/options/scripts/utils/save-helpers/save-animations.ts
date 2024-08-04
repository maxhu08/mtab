import { AnimationInitialType, BookmarkTiming, Config } from "src/newtab/scripts/config";
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

  const selectedInitialTypeEl = document.querySelector(
    `button[btn-option-type="animations-initial-type"][selected="yes"]`
  ) as HTMLButtonElement;

  const animationsInitialTypePairs: Record<string, AnimationInitialType> = {
    "animations-initial-type-down-bouncy-button": "animate-down-bouncy",
    "animations-initial-type-down-smooth-button": "animate-down-smooth",
    "animations-initial-type-down-fall-button": "animate-down-fall",
    "animations-initial-type-up-bouncy-button": "animate-up-bouncy",
    "animations-initial-type-up-smooth-button": "animate-up-smooth",
    "animations-initial-type-grow-scale-button": "animate-grow-scale",
    "animations-initial-type-fly-left-button": "animate-fly-left",
    "animations-initial-type-fly-right-button": "animate-fly-right"
  };

  draft.animations.initialType = animationsInitialTypePairs[selectedInitialTypeEl.id];
};
