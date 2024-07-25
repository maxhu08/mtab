import { Config } from "src/newtab/scripts/config";
import {
  animationsBookmarkTimingLeftButtonEl,
  animationsBookmarkTimingRightButtonEl,
  animationsBookmarkTimingUniformButtonEl,
  animationsEnabledCheckboxEl,
  animationsTypeDownBouncyButtonEl,
  animationsTypeDownFallButtonEl,
  animationsTypeDownSmoothButtonEl,
  animationsTypeGrowScaleEl,
  animationsTypeUpBouncyButtonEl,
  animationsTypeUpSmoothEl
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

  switch (config.animations.type) {
    case "animate-down-bouncy": {
      animationsTypeDownBouncyButtonEl.click();
      break;
    }
    case "animate-down-fall": {
      animationsTypeDownFallButtonEl.click();
      break;
    }
    case "animate-down-smooth": {
      animationsTypeDownSmoothButtonEl.click();
      break;
    }
    case "animate-up-bouncy": {
      animationsTypeUpBouncyButtonEl.click();
      break;
    }
    case "animate-up-smooth": {
      animationsTypeUpSmoothEl.click();
      break;
    }
    case "animate-grow-scale": {
      animationsTypeGrowScaleEl.click();
      break;
    }
  }
};
