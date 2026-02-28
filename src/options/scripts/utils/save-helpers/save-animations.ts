import {
  AnimationBookmarkType,
  AnimationInitialType,
  AnimationSearchType,
  BookmarkTiming,
  Config
} from "~/src/utils/config";
import { animationsEnabledCheckboxEl } from "~/src/options/scripts/ui";
import { getSelectedButton } from "~/src/options/scripts/utils/get-selected-button";

export const saveAnimationsToDraft = (draft: Config) => {
  draft.animations.enabled = animationsEnabledCheckboxEl.checked;

  const selectedBookmarkTimingEl = getSelectedButton("animations-bookmark-timing");
  const bookmarkTimingPairs: Record<string, BookmarkTiming> = {
    "animations-bookmark-timing-left-button": "left",
    "animations-bookmark-timing-right-button": "right",
    "animations-bookmark-timing-uniform-button": "uniform"
  };
  if (selectedBookmarkTimingEl) {
    draft.animations.bookmarkTiming = bookmarkTimingPairs[selectedBookmarkTimingEl.id];
  }

  const selectedInitialTypeEl = getSelectedButton("animations-initial-type");
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
  if (selectedInitialTypeEl) {
    draft.animations.initialType = animationsInitialTypePairs[selectedInitialTypeEl.id];
  }

  const selectedSearchTypeEl = getSelectedButton("animations-search-type");
  const animationsSearchTypePairs: Record<string, AnimationSearchType> = {
    "animations-search-type-page-shrink-button": "animate-page-shrink",
    "animations-search-type-page-scale-button": "animate-page-scale",
    "animations-search-type-page-up-button": "animate-page-up",
    "animations-search-type-page-down-button": "animate-page-down"
  };
  if (selectedSearchTypeEl) {
    draft.animations.searchType = animationsSearchTypePairs[selectedSearchTypeEl.id];
  }

  const selectedBookmarkTypeEl = getSelectedButton("animations-bookmark-type");
  const animationsBookmarkTypePairs: Record<string, AnimationBookmarkType> = {
    "animations-bookmark-type-page-shrink-button": "animate-page-shrink",
    "animations-bookmark-type-page-scale-button": "animate-page-scale",
    "animations-bookmark-type-page-up-button": "animate-page-up",
    "animations-bookmark-type-page-down-button": "animate-page-down"
  };
  if (selectedBookmarkTypeEl) {
    draft.animations.bookmarkType = animationsBookmarkTypePairs[selectedBookmarkTypeEl.id];
  }
};
