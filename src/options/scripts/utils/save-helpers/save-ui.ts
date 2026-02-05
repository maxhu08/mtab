import { Config } from "src/utils/config";
import {
  uiForegroundColorInputEl,
  uiHighlightColorInputEl,
  uiCustomCSSTextareaEl,
  uiGlassColorInputEl,
  uiBlurStrengthInputEl
} from "src/options/scripts/ui";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";

export const saveUISettingsToDraft = (draft: Config) => {
  const selectedStyleEl = getSelectedButton("ui-style");

  if (selectedStyleEl) {
    switch (selectedStyleEl.id) {
      case "ui-style-solid-button":
        draft.ui.style = "solid";
        break;
      case "ui-style-glass-button":
        draft.ui.style = "glass";
        break;
    }
  }

  draft.ui.glassColor = uiGlassColorInputEl.value;
  draft.ui.blurStrength = uiBlurStrengthInputEl.value;
  draft.ui.foregroundColor = uiForegroundColorInputEl.value;
  draft.ui.highlightColor = uiHighlightColorInputEl.value;

  const selectedCornerStyleEl = getSelectedButton("ui-corner-style");

  if (selectedCornerStyleEl) {
    if (selectedCornerStyleEl.id === "ui-corner-style-sharp-button") {
      draft.ui.cornerStyle = "sharp";
    } else if (selectedCornerStyleEl.id === "ui-corner-style-round-button") {
      draft.ui.cornerStyle = "round";
    }
  }

  draft.ui.customCSS = uiCustomCSSTextareaEl.value;
};
