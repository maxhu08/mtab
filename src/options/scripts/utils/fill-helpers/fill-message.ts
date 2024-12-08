import { Config, FontType, MessageType } from "src/newtab/scripts/config";
import {
  messageCustomTextInputEl,
  messageEnabledCheckboxEl,
  messageFontCustomInputEl,
  messageFontTypeCustomButtonEl,
  messageFontTypeDefaultButtonEl,
  messageTextColorInputEl,
  messageTypeAfternoonMorningButtonEl,
  messageTypeCustomButtonEl,
  messageTypeDateButtonEl,
  messageTypeTime12ButtonEl,
  messageTypeTime24ButtonEl
} from "src/options/scripts/ui";

export const fillMessageInputs = (config: Config) => {
  messageEnabledCheckboxEl.checked = config.message.enabled;

  const messageFontTypePairs: Record<FontType, HTMLButtonElement> = {
    default: messageFontTypeDefaultButtonEl,
    custom: messageFontTypeCustomButtonEl
  };
  messageFontTypePairs[config.message.font.type].click();

  messageFontCustomInputEl.value = config.message.font.custom;
  messageTextColorInputEl.value = config.message.textColor;

  // prettier-ignore
  const messageTypePairs: Record<MessageType, HTMLButtonElement> = {
    "afternoon-morning": messageTypeAfternoonMorningButtonEl,
    "date": messageTypeDateButtonEl,
    "time-12": messageTypeTime12ButtonEl,
    "time-24": messageTypeTime24ButtonEl,
    "custom": messageTypeCustomButtonEl
  };
  messageTypePairs[config.message.type].click();

  messageCustomTextInputEl.value = config.message.customText;
};
