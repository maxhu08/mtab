import { Config } from "src/newtab/scripts/config";
import { uiBackgroundColorInputEl, uiForegroundColorInputEl } from "src/options/scripts/ui";

export const saveUISettingsToDraft = (draft: Config) => {
  const selectedEl = document.querySelector(
    `button[btn-option-type="ui-style"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedEl.id) {
    case "ui-style-solid-button": {
      draft.ui.style = "solid";
      break;
    }
    case "ui-style-glass-button": {
      draft.ui.style = "glass";
      break;
    }
  }

  draft.ui.foregroundColor = uiForegroundColorInputEl.value;
  draft.ui.backgroundColor = uiBackgroundColorInputEl.value;
};
