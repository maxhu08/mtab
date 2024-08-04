import { Config, AnimationInitialType, BookmarkTiming } from "src/newtab/scripts/config";
import {
  animationsEnabledCheckboxEl,
  animationsBookmarkTimingLeftButtonEl,
  animationsBookmarkTimingRightButtonEl,
  animationsBookmarkTimingUniformButtonEl,
  animationsInitialTypeDownBouncyButtonEl,
  animationsInitialTypeDownSmoothButtonEl,
  animationsInitialTypeDownFallButtonEl,
  animationsInitialTypeUpBouncyButtonEl,
  animationsInitialTypeUpSmoothEl,
  animationsInitialTypeGrowScaleEl,
  animationsInitialTypeFlyLeftEl,
  animationsInitialTypeFlyRightEl
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
    "animate-up-smooth": animationsInitialTypeUpSmoothEl,
    "animate-grow-scale": animationsInitialTypeGrowScaleEl,
    "animate-fly-left": animationsInitialTypeFlyLeftEl,
    "animate-fly-right": animationsInitialTypeFlyRightEl
  };

  animationsInitialTypePairs[config.animations.initialType].click();
};
