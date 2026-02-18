import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { listenToKeys } from "src/options/scripts/keybinds";
import { listenToInputs } from "src/options/scripts/inputs";
import { handleWallpaperFileUpload } from "src/options/scripts/utils/upload-wallpaper";
import { getConfig } from "src/utils/config";
import { getUserAgent } from "src/utils/user-agent";
import { handleSwitches } from "src/options/scripts/utils/handle-switch";
import {
  fixAllToggleCheckboxSections,
  listenAllToggleCheckboxSections
} from "src/options/scripts/utils/toggle-checkbox";
import { handleCustomFaviconUpload } from "src/options/scripts/utils/upload-favicon";
import { createCollapseGroups } from "src/options/scripts/utils/collapse-option";
import { handleControls } from "src/options/scripts/utils/control-utils";
import { handleWallpaperChange } from "src/options/scripts/utils/handle-wallpaper-change";
import { getSelectedButton } from "src/options/scripts/utils/get-selected-button";
import { renderWallpaperGallery } from "src/options/scripts/utils/upload-wallpaper";
import {
  initDelegatedHandlers,
  initSortableForExistingDropzones,
  initTooltipsDelegated
} from "src/options/scripts/utils/bookmarks/handle-bookmark-ui";

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

createCollapseGroups();

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
handleWallpaperChange();

handleSwitches();

const selectedWallpaperTypeButton = getSelectedButton("wallpaper-type");
if (selectedWallpaperTypeButton) selectedWallpaperTypeButton.click();
void renderWallpaperGallery();

listenAllToggleCheckboxSections();

handleControls();

initDelegatedHandlers();
initTooltipsDelegated();
initSortableForExistingDropzones();
