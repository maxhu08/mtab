import { Config } from "src/newtab/scripts/config";
import { titleDefaultTitleInputEl, titleDynamicEnabledCheckboxEl } from "src/options/scripts/ui";

export const saveTitleSettingsToDraft = (draft: Config) => {
  draft.title.defaultTitle = titleDefaultTitleInputEl.value;
  draft.title.dynamic.enabled = titleDynamicEnabledCheckboxEl.checked;

  const selectedEl = document.querySelector(`button[btn-option-type="favicon-type"][selected="yes"]`) as HTMLButtonElement;

  switch (selectedEl.id) {
    case "title-favicon-type-default-button": {
      draft.title.faviconType = "default";
      break;
    }
    case "title-favicon-type-custom-button": {
      draft.title.faviconType = "custom";
      break;
    }
  }
};
