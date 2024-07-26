import { Config, AnimationType } from "src/newtab/scripts/config";
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

  switch (config.animations.bookmarkTiming) {
    case "left": {
      animationsBookmarkTimingLeftButtonEl.click();
      break;
    }
    case "right": {
      animationsBookmarkTimingRightButtonEl.click();
      break;
    }
    case "uniform": {
      animationsBookmarkTimingUniformButtonEl.click();
      break;
    }
  }

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
