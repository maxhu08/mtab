import { Config } from "src/utils/config";
import {
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

const toNumericInputValue = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed.toString() : "";
};

export const fillUIInputs = (config: Config) => {
  if (config.ui.style === "solid") uiStyleSolidButtonEl.click();
  else if (config.ui.style === "glass") uiStyleGlassButtonEl.click();

  uiGlassColorInputEl.value = config.ui.glassColor;
  uiBlurStrengthInputEl.value = toNumericInputValue(config.ui.blurStrength);
  uiForegroundColorInputEl.value = config.ui.foregroundColor;
  uiHighlightColorInputEl.value = config.ui.highlightColor;

  if (config.ui.cornerStyle === "sharp") uiCornerStyleSharpButtonEl.click();
  else if (config.ui.cornerStyle === "round") uiCornerStyleRoundButtonEl.click();

  uiCustomCSSTextareaEl.value = config.ui.customCSS;
};
