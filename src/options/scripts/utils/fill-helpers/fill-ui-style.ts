import { Config } from "src/newtab/scripts/config";
import { uiStyleGlassButtonEl, uiStyleSolidButtonEl } from "src/options/scripts/ui";

export const fillUIStyleInputs = (config: Config) => {
  switch (config.uiStyle) {
    case "solid": {
      uiStyleSolidButtonEl.click();
      break;
    }
    case "glass": {
      uiStyleGlassButtonEl.click();
      break;
    }
  }
};
