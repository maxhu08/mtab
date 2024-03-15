import { Config } from "src/newtab/scripts/config";

export const saveUiStyleToDraft = (draft: Config) => {
  const selectedEl = document.querySelector(
    `button[btn-option-type="ui-style"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedEl.id) {
    case "ui-style-solid-button": {
      draft.uiStyle = "solid";
      break;
    }
    case "ui-style-glass-button": {
      draft.uiStyle = "glass";
      break;
    }
  }
};
