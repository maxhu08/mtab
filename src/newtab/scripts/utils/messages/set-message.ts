import { MessageType } from "src/utils/config";
import { messageEl } from "src/newtab/scripts/ui";
import { setMorningAfternoonMessage } from "src/newtab/scripts/utils/messages/afternoon-morning";
import {
  containsSlashReplacements,
  setCustomMessage
} from "src/newtab/scripts/utils/messages/custom";
import { setDateMessage } from "src/newtab/scripts/utils/messages/date";
import { setTimeMessage } from "src/newtab/scripts/utils/messages/time";
import { setWeatherMessage } from "src/newtab/scripts/utils/messages/weather";

let messageUpdateIntervalId: number | null = null;

const clearMessageUpdateInterval = () => {
  if (messageUpdateIntervalId !== null) {
    window.clearInterval(messageUpdateIntervalId);
    messageUpdateIntervalId = null;
  }
};

export const setMessage = (
  enabled: boolean,
  type: MessageType,
  customText: string,
  username: string,
  weatherUnitsType: "f" | "c"
) => {
  clearMessageUpdateInterval();

  if (!enabled || (type === "custom" && customText.length === 0)) {
    messageEl.textContent = "\n";

    return;
  }

  switch (type) {
    case "custom": {
      setCustomMessage(messageEl, customText);

      if (containsSlashReplacements(customText)) {
        messageUpdateIntervalId = window.setInterval(() => {
          setCustomMessage(messageEl, customText);
        }, 1000);
      }

      break;
    }
    case "date": {
      setDateMessage(messageEl);
      break;
    }
    case "afternoon-morning": {
      setMorningAfternoonMessage(messageEl, username);
      break;
    }
    case "time-12": {
      setTimeMessage(messageEl, "12hr");
      messageUpdateIntervalId = window.setInterval(() => {
        setTimeMessage(messageEl, "12hr");
      }, 1000);
      break;
    }
    case "time-24": {
      setTimeMessage(messageEl, "24hr");
      messageUpdateIntervalId = window.setInterval(() => {
        setTimeMessage(messageEl, "24hr");
      }, 1000);
      break;
    }
    case "weather": {
      setWeatherMessage(messageEl, weatherUnitsType);
      break;
    }
  }
};
