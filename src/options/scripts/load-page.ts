import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { listenToKeys } from "src/options/scripts/keybinds";
import { listenToInputs } from "src/options/scripts/inputs";
import { handleWallpaperFileUpload } from "src/options/scripts/utils/upload-wallpaper";
import { getConfig } from "src/newtab/scripts/config";
import { getUserAgent } from "src/util-scripts/user-agent";
import {
  handleMessageTypeSwitch,
  handleWallpaperTypeSwitch,
  handleBookmarksTypeSwitch
} from "src/options/scripts/utils/handle-switch";
import {
  fixAllToggleCheckboxSections,
  listenAllToggleCheckboxSections
} from "src/options/scripts/utils/toggle-checkbox";
import { handleCustomFaviconUpload } from "src/options/scripts/utils/upload-favicon";

export const loadPage = () => {
  const logo = document.getElementById("mtab-logo") as HTMLImageElement;
  logo.classList.add("animate-up-bouncy");

  logo.addEventListener(
    "animationend",
    () => {
      logo.classList.replace("animate-up-bouncy", "animate-float");
    },
    {
      once: true
    }
  );

  getConfig(({ config }) => {
    fillInputs(config);

    fixAllToggleCheckboxSections();
  });

  (document.getElementById("version-number-text") as HTMLSpanElement).textContent +=
    chrome.runtime.getManifest().version;

  (document.getElementById("user-agent-text") as HTMLSpanElement).textContent += getUserAgent();

  listenToInputs();
  listenToKeys();

  handleCustomFaviconUpload();
  handleWallpaperFileUpload();

  handleMessageTypeSwitch();
  handleWallpaperTypeSwitch();
  handleBookmarksTypeSwitch();

  listenAllToggleCheckboxSections();
};
