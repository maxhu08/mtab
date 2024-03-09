// config
import { config } from "src/scripts/config";

// utils
import {
  setCustomMessage,
  setMorningAfternoonMessage,
  setTimeMessage
} from "src/scripts/utils/set-message";
import { setTitle } from "src/scripts/utils/set-title";

// key events
import { listenToKeys } from "src/scripts/keys";

// initial page load
setTitle(config.title);

// setCustomMessage(`Hello, ${config.user.name}`);
setMorningAfternoonMessage(config.user.name);
// setTimeMessage("12hr");

listenToKeys();
