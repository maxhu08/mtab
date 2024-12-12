import { Config, FontType, MessageType } from "src/newtab/scripts/config";
import {
  messageCustomTextInputEl,
  messageEnabledCheckboxEl,
  messageFontCustomInputEl,
  messageFontTypeCustomButtonEl,
  messageFontTypeDefaultButtonEl,
  messageTextColorInputEl,
  messageTextSizeInputEl,
  messageTypeAfternoonMorningButtonEl,
  messageTypeCustomButtonEl,
  messageTypeDateButtonEl,
  messageTypeTime12ButtonEl,
  messageTypeTime24ButtonEl,
  messageTypeWeatherButtonEl,
  messageWeatherUnitsTypeFButton
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
  messageTextSizeInputEl.value = config.message.textSize.toString();

  // prettier-ignore
  const messageTypePairs: Record<MessageType, HTMLButtonElement> = {
    "afternoon-morning": messageTypeAfternoonMorningButtonEl,
    "date": messageTypeDateButtonEl,
    "time-12": messageTypeTime12ButtonEl,
    "time-24": messageTypeTime24ButtonEl,
    "weather": messageTypeWeatherButtonEl,
    "custom": messageTypeCustomButtonEl
  };
  messageTypePairs[config.message.type].click();

  const messageWeatherUnitTypePairs: Record<"f" | "c", HTMLButtonElement> = {
    f: messageWeatherUnitsTypeFButton,
    c: messageWeatherUnitsTypeFButton
  };
  messageWeatherUnitTypePairs[config.message.weather.unitsType].click();

  messageCustomTextInputEl.value = config.message.customText;
};
