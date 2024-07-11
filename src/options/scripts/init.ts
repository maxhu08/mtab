import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { listenToKeys } from "src/options/scripts/keybinds";
import { listenToInputs } from "src/options/scripts/inputs";
import { handleWallpaperFileUpload } from "src/options/scripts/utils/file-upload";
import { getConfig } from "src/newtab/scripts/config";
import { getUserAgent } from "src/util-scripts/user-agent";
import {
  handleMessageTypeSwitch,
  handleWallpaperTypeSwitch,
  handleBookmarksTypeSwitch
} from "src/options/scripts/utils/handle-switch";
import { listenToggleCheckboxSection } from "src/options/scripts/utils/toggle-checkbox";

getConfig(({ config }) => {
  fillInputs(config);
});

(document.getElementById("version-number-text") as HTMLSpanElement).textContent +=
  chrome.runtime.getManifest().version;

(document.getElementById("user-agent-text") as HTMLSpanElement).textContent += getUserAgent();

listenToInputs();
listenToKeys();
handleWallpaperFileUpload();

handleMessageTypeSwitch();
handleWallpaperTypeSwitch();
handleBookmarksTypeSwitch();

listenToggleCheckboxSection("wallpaper-enabled-checkbox", "wallpaper-enabled-section");
listenToggleCheckboxSection("animations-enabled-checkbox", "animations-enabled-section");
listenToggleCheckboxSection("search-enabled-checkbox", "search-enabled-section");
listenToggleCheckboxSection("hotkeys-enabled-checkbox", "hotkeys-enabled-section");
