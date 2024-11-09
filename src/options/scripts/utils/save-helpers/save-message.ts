import { Config, MessageType } from "src/newtab/scripts/config";
import {
  messageEnabledCheckboxEl,
  messageFontInputEl,
  messageTextColorInputEl,
  messageCustomTextInputEl
} from "src/options/scripts/ui";

export const saveMessageSettingsToDraft = (draft: Config) => {
  draft.message.enabled = messageEnabledCheckboxEl.checked;

  // font
  draft.message.font = messageFontInputEl.value;
  draft.message.textColor = messageTextColorInputEl.value;

  // type
  const selectedEl = document.querySelector(
    `button[btn-option-type="message-type"][selected="yes"]`
  ) as HTMLButtonElement;

  const messageTypePairs: Record<string, MessageType> = {
    "message-type-afternoon-morning-button": "afternoon-morning",
    "message-type-date-button": "date",
    "message-type-time-12-button": "time-12",
    "message-type-time-24-button": "time-24",
    "message-type-custom-button": "custom"
  };

  draft.message.type = messageTypePairs[selectedEl.id];

  draft.message.customText = messageCustomTextInputEl.value;
};
