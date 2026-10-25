import { fillInputs } from "~/src/options/scripts/utils/fill-inputs";
import { listenToKeys } from "~/src/options/scripts/keybinds";
import { listenToInputs } from "~/src/options/scripts/inputs";
import { handleWallpaperFileUpload } from "~/src/options/scripts/utils/upload-wallpaper";
import { Config, getConfig } from "~/src/utils/config";
import { getOptionsData, OptionsData } from "~/src/utils/options-data";
import { getUserAgent } from "~/src/utils/user-agent";
import { handleSwitches } from "~/src/options/scripts/utils/handle-switch";
import {
  fixAllToggleCheckboxSections,
  listenAllToggleCheckboxSections
} from "~/src/options/scripts/utils/toggle-checkbox";
import { handleCustomFaviconUpload } from "~/src/options/scripts/utils/upload-favicon";
import { createCollapseGroups } from "~/src/options/scripts/utils/collapse-option";
import { handleControls } from "~/src/options/scripts/utils/control-utils";
import { renderWallpaperGallery } from "~/src/options/scripts/utils/upload-wallpaper";
import {
  initDelegatedHandlers,
  initSortableForExistingDropzones,
  initTooltipsDelegated
} from "~/src/options/scripts/utils/bookmarks/handle-bookmark-ui";
import { initCustomCSSHighlight } from "~/src/options/scripts/utils/custom-css-highlight";
import { initColorInputControls } from "~/src/options/scripts/utils/color-inputs";
import { initIconInputControls } from "~/src/options/scripts/utils/icon-inputs";
import { initializeI18n } from "~/src/options/scripts/i18n";

const initialize = (config: Config, optionsData: OptionsData) => {
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

  createCollapseGroups(optionsData);
  initCustomCSSHighlight();
  initColorInputControls();
  initIconInputControls();

  const manifest = chrome.runtime.getManifest();
  const displayVersion =
    document.documentElement.getAttribute("rc-version-info")?.trim() || manifest.version;

  (document.getElementById("version-number-text") as HTMLSpanElement).textContent += displayVersion;

  (document.getElementById("user-agent-text") as HTMLSpanElement).textContent += getUserAgent();

  listenToInputs();
  listenToKeys();

  handleCustomFaviconUpload();
  handleWallpaperFileUpload();

  handleSwitches();

  listenAllToggleCheckboxSections();

  fillInputs(config);
  fixAllToggleCheckboxSections();

  handleControls();

  initDelegatedHandlers();
  initTooltipsDelegated();
  initSortableForExistingDropzones();

  // Only local layout work blocks releasing the hint, never wallpaper media downloads.
  void Promise.all([document.fonts.ready, renderWallpaperGallery()]).finally(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("options-initializing");
      window.dispatchEvent(new Event("options-ready"));
    });
  });
};

void Promise.all([
  initializeI18n(),
  new Promise<{ config: Config }>(getConfig),
  new Promise<{ optionsData: OptionsData }>(getOptionsData)
]).then((data) => initialize(data[1].config, data[2].optionsData));