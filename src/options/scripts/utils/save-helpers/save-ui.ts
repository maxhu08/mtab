import { Config } from "src/newtab/scripts/config";
import { uiBackgroundColorInputEl, uiForegroundColorInputEl, uiHighlightColorInputEl, uiCustomCSSTextareaEl, uiGlassColorInputEl, uiBlurStrengthInputEl } from "src/options/scripts/ui";

export const saveUISettingsToDraft = (draft: Config) => {
  const selectedStyleEl = document.querySelector(`button[btn-option-type="ui-style"][selected="yes"]`) as HTMLButtonElement;

  switch (selectedStyleEl.id) {
    case "ui-style-solid-button": {
      draft.ui.style = "solid";
      break;
    }
    case "ui-style-glass-button": {
      draft.ui.style = "glass";
      break;
    }
  }

  draft.ui.glassColor = uiGlassColorInputEl.value;
  draft.ui.blurStrength = uiBlurStrengthInputEl.value;
  draft.ui.foregroundColor = uiForegroundColorInputEl.value;
  draft.ui.backgroundColor = uiBackgroundColorInputEl.value;
  draft.ui.highlightColor = uiHighlightColorInputEl.value;

  const selectedCornerStyleEl = document.querySelector(`button[btn-option-type="ui-corner-style"][selected="yes"]`) as HTMLButtonElement;

  switch (selectedCornerStyleEl.id) {
    case "ui-corner-style-sharp-button": {
      draft.ui.cornerStyle = "sharp";
      break;
    }
    case "ui-corner-style-round-button": {
      draft.ui.cornerStyle = "round";
      break;
    }
  }

  draft.ui.customCSS = uiCustomCSSTextareaEl.value;
};
