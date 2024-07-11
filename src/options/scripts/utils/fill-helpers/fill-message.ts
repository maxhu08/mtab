import { Config } from "src/newtab/scripts/config";
import {
  messageCustomTextInputEl,
  messageEnabledCheckboxEl,
  messageFontInputEl,
  messageTextColorInputEl,
  messageTypeAfternoonMorningButtonEl,
  messageTypeCustomButtonEl,
  messageTypeDateButtonEl,
  messageTypeTime12ButtonEl,
  messageTypeTime24ButtonEl
} from "src/options/scripts/ui";

export const fillMessageInputs = (config: Config) => {
  messageEnabledCheckboxEl.checked = config.message.enabled;
  messageFontInputEl.value = config.message.font;
  messageTextColorInputEl.value = config.message.textColor;

  switch (config.message.type) {
    case "afternoon-morning": {
      messageTypeAfternoonMorningButtonEl.click();
      break;
    }
    case "date": {
      messageTypeDateButtonEl.click();
      break;
    }
    case "time-12": {
      messageTypeTime12ButtonEl.click();
      break;
    }
    case "time-24": {
      messageTypeTime24ButtonEl.click();
      break;
    }
    case "custom": {
      messageTypeCustomButtonEl.click();
      break;
    }
  }

  messageCustomTextInputEl.value = config.message.customText;
};
