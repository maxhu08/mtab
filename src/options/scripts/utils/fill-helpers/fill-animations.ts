import { Config, AnimationType, BookmarkTiming } from "src/newtab/scripts/config";
import {
  animationsEnabledCheckboxEl,
  animationsBookmarkTimingLeftButtonEl,
  animationsBookmarkTimingRightButtonEl,
  animationsBookmarkTimingUniformButtonEl,
  animationsTypeDownBouncyButtonEl,
  animationsTypeDownSmoothButtonEl,
  animationsTypeDownFallButtonEl,
  animationsTypeUpBouncyButtonEl,
  animationsTypeUpSmoothEl,
  animationsTypeGrowScaleEl,
  animationsTypeFlyLeftEl,
  animationsTypeFlyRightEl
} from "src/options/scripts/ui";

export const fillAnimationsInputs = (config: Config) => {
  animationsEnabledCheckboxEl.checked = config.animations.enabled;

  const bookmarkTimingPairs: Record<BookmarkTiming, HTMLButtonElement> = {
    left: animationsBookmarkTimingLeftButtonEl,
    right: animationsBookmarkTimingRightButtonEl,
    uniform: animationsBookmarkTimingUniformButtonEl
  };

  bookmarkTimingPairs[config.animations.bookmarkTiming].click();

  const animationsTypePairs: Record<AnimationType, HTMLButtonElement> = {
    "animate-down-bouncy": animationsTypeDownBouncyButtonEl,
    "animate-down-smooth": animationsTypeDownSmoothButtonEl,
    "animate-down-fall": animationsTypeDownFallButtonEl,
    "animate-up-bouncy": animationsTypeUpBouncyButtonEl,
    "animate-up-smooth": animationsTypeUpSmoothEl,
    "animate-grow-scale": animationsTypeGrowScaleEl,
    "animate-fly-left": animationsTypeFlyLeftEl,
    "animate-fly-right": animationsTypeFlyRightEl
  };

  animationsTypePairs[config.animations.type].click();
};
