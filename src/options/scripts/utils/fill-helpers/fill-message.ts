import { Config, MessageType } from "src/newtab/scripts/config";
import { messageCustomTextInputEl, messageEnabledCheckboxEl, messageFontInputEl, messageTextColorInputEl, messageTypeAfternoonMorningButtonEl, messageTypeCustomButtonEl, messageTypeDateButtonEl, messageTypeTime12ButtonEl, messageTypeTime24ButtonEl } from "src/options/scripts/ui";

export const fillMessageInputs = (config: Config) => {
  messageEnabledCheckboxEl.checked = config.message.enabled;
  messageFontInputEl.value = config.message.font;
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
