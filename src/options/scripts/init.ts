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
import {
  checkToggleCheckboxSection,
  listenToggleCheckboxSection
} from "src/options/scripts/utils/toggle-checkbox";

const checkboxSections = [
  ["wallpaper-enabled-checkbox", "wallpaper-enabled-section"],
  ["animations-enabled-checkbox", "animations-enabled-section"],
  ["search-enabled-checkbox", "search-enabled-section"],
  ["hotkeys-enabled-checkbox", "hotkeys-enabled-section"]
];

getConfig(({ config }) => {
  fillInputs(config);

  for (let i = 0; i < checkboxSections.length; i++) {
    checkToggleCheckboxSection(checkboxSections[i][0], checkboxSections[i][1]);
  }
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

for (let i = 0; i < checkboxSections.length; i++) {
  listenToggleCheckboxSection(checkboxSections[i][0], checkboxSections[i][1]);
}
