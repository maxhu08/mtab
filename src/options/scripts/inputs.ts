import { oconfig } from "src/options/scripts/oconfig";
import { buttonSwitches, inputs } from "./ui";
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

  searchCustomEnabledCheckboxEl
} from "src/options/scripts/ui";

export const listenToInputs = () => {
  inputs.forEach((input) => {
    input.input.addEventListener("blur", () =>
      unfocusInput({
        container: input.container,
        input: input.input,
        borderClassOld: oconfig.inputBorderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.input.addEventListener("focus", (e) =>
      focusInput({
        container: input.container,
        input: input.input,
        borderClassOld: "border-transparent",
        borderClassNew: oconfig.inputBorderClass,
        e
      })
    );
  });

  buttonSwitches.forEach((btnSwitch) => {
    switchButtons(btnSwitch.buttons, btnSwitch.attr);
  });

  //Special case for using a custom search engine
  // if custom search engine is enabled, then disable it
  const arrayOfSearchEngines = [
    searchEngineDuckduckgoButtonEl,
    searchEngineGoogleButtonEl,
    searchEngineBingButtonEl,
    searchEngineBraveButtonEl,
    searchEngineYahooButtonEl,
    searchEngineYandexButtonEl,
    searchEngineStartpageButtonEl,
    searchEngineEcosiaButtonEl,
  ]

  arrayOfSearchEngines.forEach((searchEngine) => {
    searchEngine.addEventListener("click", () => {
      if (searchCustomEnabledCheckboxEl.checked) {
        searchCustomEnabledCheckboxEl.click();
      }
    });
  });
};

export const unfocusInput = ({
  container,
  input,
  borderClassOld,
  borderClassNew
}: {
  container: HTMLDivElement;
  input: HTMLInputElement;
  borderClassOld: string;
  borderClassNew: string;
}) => {
  input.blur();

  container.classList.replace(borderClassOld, borderClassNew);
};

export const focusInput = ({
  container,
  input,
  borderClassOld,
  borderClassNew,
  e
}: {
  container: HTMLDivElement;
  input: HTMLInputElement;
  borderClassOld: string;
  borderClassNew: string;
  e: Event;
}) => {
  container.classList.replace(borderClassOld, borderClassNew);

  input.focus();
  e.preventDefault();
};
