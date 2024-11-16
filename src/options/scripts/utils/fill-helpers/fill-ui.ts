import { Config } from "src/newtab/scripts/config";
import {
  uiBackgroundColorInputEl,
  uiForegroundColorInputEl,
  uiHighlightColorInputEl,
  uiStyleGlassButtonEl,
  uiStyleSolidButtonEl,
  uiCustomCSSTextareaEl,
  uiCornerStyleSharpButtonEl,
  uiCornerStyleRoundButtonEl,
  uiGlassColorInputEl,
  uiBlurStrengthInputEl
} from "src/options/scripts/ui";

export const fillUIInputs = (config: Config) => {
  if (config.ui.style === "solid") uiStyleSolidButtonEl.click();
  else if (config.ui.style === "glass") uiStyleGlassButtonEl.click();

  uiGlassColorInputEl.value = config.ui.glassColor;
  uiBlurStrengthInputEl.value = config.ui.blurStrength;
  uiForegroundColorInputEl.value = config.ui.foregroundColor;
  uiBackgroundColorInputEl.value = config.ui.backgroundColor;
  uiHighlightColorInputEl.value = config.ui.highlightColor;

  if (config.ui.cornerStyle === "sharp") uiCornerStyleSharpButtonEl.click();
  else if (config.ui.cornerStyle === "round") uiCornerStyleRoundButtonEl.click();

  uiCustomCSSTextareaEl.value = config.ui.customCSS;
};
