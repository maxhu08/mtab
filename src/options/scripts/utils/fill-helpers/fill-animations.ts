import { Config, AnimationInitialType, BookmarkTiming, AnimationSearchType, AnimationBookmarkType } from "src/newtab/scripts/config";
import {
  animationsEnabledCheckboxEl,
  animationsBookmarkTimingLeftButtonEl,
  animationsBookmarkTimingRightButtonEl,
  animationsBookmarkTimingUniformButtonEl,
  animationsInitialTypeDownBouncyButtonEl,
  animationsInitialTypeDownSmoothButtonEl,
  animationsInitialTypeDownFallButtonEl,
  animationsInitialTypeUpBouncyButtonEl,
  animationsInitialTypeUpSmoothButtonEl,
  animationsInitialTypeGrowScaleButtonEl,
  animationsInitialTypeFlyLeftButtonEl,
  animationsInitialTypeFlyRightButtonEl,
  animationsSearchTypePageShrinkButtonEl,
  animationsSearchTypePageScaleButtonEl,
  animationsSearchTypePageUpButtonEl,
  animationsSearchTypePageDownButtonEl,
  animationsBookmarkTypePageShrinkButtonEl,
  animationsBookmarkTypePageScaleButtonEl,
  animationsBookmarkTypePageUpButtonEl,
  animationsBookmarkTypePageDownButtonEl
} from "src/options/scripts/ui";

export const fillAnimationsInputs = (config: Config) => {
  animationsEnabledCheckboxEl.checked = config.animations.enabled;

  const bookmarkTimingPairs: Record<BookmarkTiming, HTMLButtonElement> = {
    left: animationsBookmarkTimingLeftButtonEl,
    right: animationsBookmarkTimingRightButtonEl,
    uniform: animationsBookmarkTimingUniformButtonEl
  };

  bookmarkTimingPairs[config.animations.bookmarkTiming].click();

  const animationsInitialTypePairs: Record<AnimationInitialType, HTMLButtonElement> = {
    "animate-down-bouncy": animationsInitialTypeDownBouncyButtonEl,
    "animate-down-smooth": animationsInitialTypeDownSmoothButtonEl,
    "animate-down-fall": animationsInitialTypeDownFallButtonEl,
    "animate-up-bouncy": animationsInitialTypeUpBouncyButtonEl,
    "animate-up-smooth": animationsInitialTypeUpSmoothButtonEl,
    "animate-grow-scale": animationsInitialTypeGrowScaleButtonEl,
    "animate-fly-left": animationsInitialTypeFlyLeftButtonEl,
    "animate-fly-right": animationsInitialTypeFlyRightButtonEl
  };

  animationsInitialTypePairs[config.animations.initialType].click();

  const animationsSearchTypePairs: Record<AnimationSearchType, HTMLButtonElement> = {
    "animate-page-shrink": animationsSearchTypePageShrinkButtonEl,
    "animate-page-scale": animationsSearchTypePageScaleButtonEl,
    "animate-page-up": animationsSearchTypePageUpButtonEl,
    "animate-page-down": animationsSearchTypePageDownButtonEl
  };

  animationsSearchTypePairs[config.animations.searchType].click();

  const animationsBookmarkTypePairs: Record<AnimationBookmarkType, HTMLButtonElement> = {
    "animate-page-shrink": animationsBookmarkTypePageShrinkButtonEl,
    "animate-page-scale": animationsBookmarkTypePageScaleButtonEl,
    "animate-page-up": animationsBookmarkTypePageUpButtonEl,
    "animate-page-down": animationsBookmarkTypePageDownButtonEl
  };

  animationsBookmarkTypePairs[config.animations.bookmarkType].click();
};
