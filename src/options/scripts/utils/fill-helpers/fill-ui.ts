import { Config } from "src/newtab/scripts/config";
import {
  uiBackgroundColorInputEl,
  uiForegroundColorInputEl,
  uiHighlightColorInputEl,
  uiStyleGlassButtonEl,
  uiStyleSolidButtonEl
} from "src/options/scripts/ui";

export const fillUIInputs = (config: Config) => {
  switch (config.ui.style) {
    case "solid": {
      uiStyleSolidButtonEl.click();
      break;
    }
    case "glass": {
      uiStyleGlassButtonEl.click();
      break;
    }
  }

  uiForegroundColorInputEl.value = config.ui.foregroundColor;
  uiBackgroundColorInputEl.value = config.ui.backgroundColor;
  uiHighlightColorInputEl.value = config.ui.highlightColor;
};
