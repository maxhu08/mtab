import { buttonSwitches, hotkeyInputs } from "./ui";
import { switchButtons } from "src/options/scripts/utils/switch-buttons";

import {
  searchEngineDuckduckgoButtonEl,
  searchEngineGoogleButtonEl,
  searchEngineBingButtonEl,
  searchEngineBraveButtonEl,
  searchEngineYahooButtonEl,
  searchEngineYandexButtonEl,
  searchEngineStartpageButtonEl,
  searchEngineEcosiaButtonEl,
  searchUseCustomEngineCheckboxEl
} from "src/options/scripts/ui";
import { listenToHotkeyInputs } from "src/options/scripts/utils/hotkey-inputs";
import { saveConfig } from "src/options/scripts/utils/save-config";
import { saveAndExportConfig } from "src/options/scripts/utils/export-config";
import { setDefaultConfig } from "src/options/scripts/utils/set-default-config";
import { handleCustomFaviconReset } from "src/options/scripts/utils/upload-favicon";
import { importConfigAndSave } from "src/options/scripts/utils/import-config";
import tippy from "tippy.js";

export const listenToInputs = () => {
  buttonSwitches.forEach((btnSwitch) => {
    switchButtons(btnSwitch.buttons, btnSwitch.attr);
  });

  listenToHotkeyInputs(hotkeyInputs);

  // special case for using a custom search engine
  // if custom search engine is enabled, then disable it
  const arrayOfSearchEngines = [
    searchEngineDuckduckgoButtonEl,
    searchEngineGoogleButtonEl,
    searchEngineBingButtonEl,
    searchEngineBraveButtonEl,
    searchEngineYahooButtonEl,
    searchEngineYandexButtonEl,
    searchEngineStartpageButtonEl,
    searchEngineEcosiaButtonEl
  ];

  arrayOfSearchEngines.forEach((searchEngine) => {
    searchEngine.addEventListener("click", () => {
      if (searchUseCustomEngineCheckboxEl.checked) {
        searchUseCustomEngineCheckboxEl.click();
      }
    });
  });

  // prettier-ignore
  const resetFaviconBtn = document.getElementById("title-custom-favicon-reset-button") as HTMLButtonElement;
  resetFaviconBtn.onclick = () => handleCustomFaviconReset();

  const saveBtn = document.getElementById("save-button") as HTMLButtonElement;
  saveBtn.onclick = () => saveConfig();

  const exportBtn = document.getElementById("export-button") as HTMLButtonElement;
  exportBtn.onclick = () => saveAndExportConfig();

  const importBtn = document.getElementById("import-button") as HTMLButtonElement;
  importBtn.onclick = () => void importConfigAndSave();

  const base = {
    placement: "top" as const,
    theme: "dark",
    animation: "shift-away",
    duration: [120, 90] as [number, number],
    delay: [75, 0] as [number, number]
  };

  tippy("#save-button", {
    ...base,
    content: "save (ctrl+s)"
  });

  tippy("#export-button", {
    ...base,
    content: "save & export (ctrl+e)"
  });

  tippy("#import-button", {
    ...base,
    content: "import & save (ctrl+i)"
  });

  const resetToDefaultBtn = document.getElementById("reset-to-default-button") as HTMLButtonElement;
  resetToDefaultBtn.onclick = () => setDefaultConfig();
};
