import { Config, FontType, MessageType } from "src/newtab/scripts/config";
import {
  messageEnabledCheckboxEl,
  messageTextColorInputEl,
  messageCustomTextInputEl,
  messageFontCustomInputEl
} from "src/options/scripts/ui";

export const saveMessageSettingsToDraft = (draft: Config) => {
  draft.message.enabled = messageEnabledCheckboxEl.checked;

  // prettier-ignore
  const selectedFontTypeEl = document.querySelector(`button[btn-option-type="message-font-type"][selected="yes"]`) as HTMLButtonElement;
  const messageFontTypePairs: Record<string, FontType> = {
    "message-font-type-default-button": "default",
    "message-font-type-custom-button": "custom"
  };
  draft.message.font.type = messageFontTypePairs[selectedFontTypeEl.id];
  draft.message.font.custom = messageFontCustomInputEl.value;

  draft.message.textColor = messageTextColorInputEl.value;

  // prettier-ignore
  const selectedTypeEl = document.querySelector(`button[btn-option-type="message-type"][selected="yes"]`) as HTMLButtonElement;
  const messageTypePairs: Record<string, MessageType> = {
    "message-type-afternoon-morning-button": "afternoon-morning",
    "message-type-date-button": "date",
    "message-type-time-12-button": "time-12",
    "message-type-time-24-button": "time-24",
    "message-type-weather-button": "weather",
    "message-type-custom-button": "custom"
  };

  draft.message.type = messageTypePairs[selectedTypeEl.id];

  // prettier-ignore
  const selectedWeatherUnitsTypeEl = document.querySelector(`button[btn-option-type="message-weather-units-type"][selected="yes"]`) as HTMLButtonElement;
  const weatherUnitTypePairs: Record<string, "f" | "c"> = {
    "message-weather-units-type-f-button": "f",
    "message-weather-units-type-c-button": "c"
  };

  draft.message.weather.unitsType = weatherUnitTypePairs[selectedWeatherUnitsTypeEl.id];

  draft.message.customText = messageCustomTextInputEl.value;
};
