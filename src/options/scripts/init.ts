import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { listenToKeys } from "src/options/scripts/keybinds";
import { listenToInputs } from "src/options/scripts/inputs";
import { handleWallpaperFileUpload } from "src/options/scripts/utils/file-upload";
import { getConfig } from "src/newtab/scripts/config";
import { handleMessageTypeSwitch, handleWallpaperTypeSwitch } from "src/options/scripts/ui";
import { getUserAgent } from "src/util-scripts/user-agent";

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
