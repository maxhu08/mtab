import { AnimationBookmarkType, AnimationInitialType, AnimationSearchType, BookmarkTiming, Config } from "src/newtab/scripts/config";
import { animationsEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveAnimationsToDraft = (draft: Config) => {
  draft.animations.enabled = animationsEnabledCheckboxEl.checked;

  // prettier-ignore
  const selectedBookmarkTimingEl = document.querySelector(`button[btn-option-type="animations-bookmark-timing"][selected="yes"]`) as HTMLButtonElement;

  const bookmarkTimingPairs: Record<string, BookmarkTiming> = {
    "animations-bookmark-timing-left-button": "left",
    "animations-bookmark-timing-right-button": "right",
    "animations-bookmark-timing-uniform-button": "uniform"
  };

  draft.animations.bookmarkTiming = bookmarkTimingPairs[selectedBookmarkTimingEl.id];

  // prettier-ignore
  const selectedInitialTypeEl = document.querySelector(`button[btn-option-type="animations-initial-type"][selected="yes"]`) as HTMLButtonElement;

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

  // prettier-ignore
  const selectedSearchTypeEl = document.querySelector(`button[btn-option-type="animations-search-type"][selected="yes"]`) as HTMLButtonElement;

  const animationsSearchTypePairs: Record<string, AnimationSearchType> = {
    "animations-search-type-page-shrink-button": "animate-page-shrink",
    "animations-search-type-page-scale-button": "animate-page-scale",
    "animations-search-type-page-up-button": "animate-page-up",
    "animations-search-type-page-down-button": "animate-page-down"
  };

  draft.animations.searchType = animationsSearchTypePairs[selectedSearchTypeEl.id];

  // prettier-ignore
  const selectedBookmarkTypeEl = document.querySelector(`button[btn-option-type="animations-bookmark-type"][selected="yes"]`) as HTMLButtonElement;

  const animationsBookmarkTypePairs: Record<string, AnimationBookmarkType> = {
    "animations-bookmark-type-page-shrink-button": "animate-page-shrink",
    "animations-bookmark-type-page-scale-button": "animate-page-scale",
    "animations-bookmark-type-page-up-button": "animate-page-up",
    "animations-bookmark-type-page-down-button": "animate-page-down"
  };

  draft.animations.bookmarkType = animationsBookmarkTypePairs[selectedBookmarkTypeEl.id];
};
