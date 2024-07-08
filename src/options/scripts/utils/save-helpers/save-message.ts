import { Config } from "src/newtab/scripts/config";
import {
  messageCustomTextInputEl,
  messageFontInputEl,
  messageTextColorInputEl
} from "src/options/scripts/ui";

export const saveMessageSettingsToDraft = (draft: Config) => {
  // font
  draft.message.font = messageFontInputEl.value;
  draft.message.textColor = messageTextColorInputEl.value;

  // type
  const selectedEl = document.querySelector(
    `button[btn-option-type="message-type"][selected="yes"]`
  ) as HTMLButtonElement;

  switch (selectedEl.id) {
    case "message-type-afternoon-morning-button": {
      draft.message.type = "afternoon-morning";
      break;
    }
    case "message-type-date-button": {
      draft.message.type = "date";
      break;
    }
    case "message-type-time-12-button": {
      draft.message.type = "time-12";
      break;
    }
    case "message-type-time-24-button": {
      draft.message.type = "time-24";
      break;
    }
    case "message-type-custom-button": {
      draft.message.type = "custom";
      break;
    }
  }

  draft.message.customText = messageCustomTextInputEl.value;
};
