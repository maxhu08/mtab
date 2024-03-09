// Config
import { config } from "src/scripts/config";

// Utils
import {
  setCustomMessage,
  setMorningAfternoonMessage,
  setTimeMessage
} from "src/scripts/utils/set-message";
import { setTitle } from "src/scripts/utils/set-title";

// Key Events
import { listenToKeys } from "src/scripts/keys";
import { bookmarksContainerEl } from "src/scripts/ui";
import { renderBookmarks } from "src/scripts/utils/render-bookmarks";
import { addAnimations } from "src/scripts/utils/animations";

// ******************************************************************
// initial page load logic start

setTitle(config.title);

// setCustomMessage(`Hello, ${config.user.name}`);
setMorningAfternoonMessage(config.user.name);
// setTimeMessage("12hr");

renderBookmarks(config);

addAnimations(config.animations);

// initial page load logic end
// ******************************************************************

listenToKeys();
