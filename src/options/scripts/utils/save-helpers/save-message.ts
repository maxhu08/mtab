import { Config, FontType, MessageType } from "~/src/utils/config";
import {
  messageEnabledCheckboxEl,
  messageTextColorInputEl,
  messageCustomTextInputEl,
  messageFontCustomInputEl,
  messageTextSizeInputEl
} from "~/src/options/scripts/ui";
import { getSelectedButton } from "~/src/options/scripts/utils/get-selected-button";

export const saveMessageSettingsToDraft = (draft: Config) => {
  draft.message.enabled = messageEnabledCheckboxEl.checked;

  const selectedFontTypeEl = getSelectedButton("message-font-type");
  const messageFontTypePairs: Record<string, FontType> = {
    "message-font-type-default-button": "default",
    "message-font-type-custom-button": "custom"
  };
  if (selectedFontTypeEl) {
    draft.message.font.type = messageFontTypePairs[selectedFontTypeEl.id];
  }
  draft.message.font.custom = messageFontCustomInputEl.value;

  draft.message.textColor = messageTextColorInputEl.value;
  draft.message.textSize = parseFloat(messageTextSizeInputEl.value);

  const selectedTypeEl = getSelectedButton("message-type");
  const messageTypePairs: Record<string, MessageType> = {
    "message-type-afternoon-morning-button": "afternoon-morning",
    "message-type-date-button": "date",
    "message-type-time-12-button": "time-12",
    "message-type-time-24-button": "time-24",
    "message-type-weather-button": "weather",
    "message-type-custom-button": "custom"
  };
  if (selectedTypeEl) {
    draft.message.type = messageTypePairs[selectedTypeEl.id];
  }

  const selectedWeatherUnitsTypeEl = getSelectedButton("message-weather-units-type");
  const weatherUnitTypePairs: Record<string, "f" | "c"> = {
    "message-weather-units-type-f-button": "f",
    "message-weather-units-type-c-button": "c"
  };
  if (selectedWeatherUnitsTypeEl) {
    draft.message.weather.unitsType = weatherUnitTypePairs[selectedWeatherUnitsTypeEl.id];
  }

  draft.message.customText = messageCustomTextInputEl.value;
};
