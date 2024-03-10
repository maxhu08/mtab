// Config
import { config } from "./config";

// Utils
import { setCustomMessage, setMorningAfternoonMessage, setTimeMessage } from "./utils/set-message";
import { setTitle } from "./utils/set-title";

// Key Events
import { listenToKeys } from "./keys";
import { bookmarksContainerEl } from "./ui";
import { renderBookmarks } from "./utils/render-bookmarks";
import { addAnimations } from "./utils/animations";

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
