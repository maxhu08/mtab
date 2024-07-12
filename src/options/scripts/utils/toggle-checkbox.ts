import {
  searchEngineDuckduckgoButtonEl,
  searchEngineBingButtonEl,
  searchEngineBraveButtonEl,
  searchEngineGoogleButtonEl,
  searchEngineYahooButtonEl,
  searchEngineYandexButtonEl,
  searchEngineStartpageButtonEl,
  searchEngineEcosiaButtonEl,
} from "src/options/scripts/ui";

const checkboxSections = [
  ["message-enabled-checkbox", "message-enabled-section"],
  ["wallpaper-enabled-checkbox", "wallpaper-enabled-section"],
  ["animations-enabled-checkbox", "animations-enabled-section"],
  ["search-enabled-checkbox", "search-enabled-section"],
  ["search-custom-enabled-checkbox", "search-custom-enabled-section"],
  ["hotkeys-enabled-checkbox", "hotkeys-enabled-section"]
];

// attaches a listener to listen for change and hide/show the sectio nthe checkbox controls
export const listenAllToggleCheckboxSections = () => {
  for (let i = 0; i < checkboxSections.length; i++) {
    listenToggleCheckboxSection(checkboxSections[i][0], checkboxSections[i][1]);
  }

  //Special case for using a custom search engine
  //when the checkbox is checked, I want the currently selected search engine to be unselected

  const searchCustomEnabledCheckboxEl = document.getElementById("search-custom-enabled-checkbox") as HTMLInputElement;
  searchCustomEnabledCheckboxEl.addEventListener("change", () => {
    if (searchCustomEnabledCheckboxEl.checked) {
      //if the checkbox is checked, the previously selected search engine should be unselected (visually)
      const selectedSearchEngineEl = document.querySelector(
        `button[btn-option-type="search-engine"][selected="yes"]`
      ) as HTMLButtonElement;

      switch (selectedSearchEngineEl.id) {
        case "search-engine-duckduckgo-button": {
          searchEngineDuckduckgoButtonEl.setAttribute("selected", "no");
          break;
        }
        case "search-engine-google-button": {
          searchEngineGoogleButtonEl.setAttribute("selected", "no");
          break;
        }
        case "search-engine-bing-button": {
          searchEngineBingButtonEl.setAttribute("selected", "no");
          break;
        }
        case "search-engine-brave-button": {
          searchEngineBraveButtonEl.setAttribute("selected", "no");
          break;
        }
        case "search-engine-yahoo-button": {
          searchEngineYahooButtonEl.setAttribute("selected", "no");
          break;
        }
        case "search-engine-yandex-button": {
          searchEngineYandexButtonEl.setAttribute("selected", "no");
          break;
        }
        case "search-engine-startpage-button": {
          searchEngineStartpageButtonEl.setAttribute("selected", "no");
          break;
        }
        case "search-engine-ecosia-button": {
          searchEngineEcosiaButtonEl.setAttribute("selected", "no");
          break;
        }
      }
    } else {
      searchEngineDuckduckgoButtonEl.click();
    }
  });
};

//sets the intial state of the section the checkbox controls (hide the section if the checkbox is off, and show the section is the checkbox is on)
export const fixAllToggleCheckboxSections = () => {
  for (let i = 0; i < checkboxSections.length; i++) {
    fixToggleCheckboxSection(checkboxSections[i][0], checkboxSections[i][1]);
  }
};

const listenToggleCheckboxSection = (checkboxId: string, sectionId: string) => {
  const checkboxEl = document.getElementById(checkboxId) as HTMLInputElement;
  const sectionEl = document.getElementById(sectionId) as HTMLDivElement;

  checkboxEl.addEventListener("change", () => {
    if (checkboxEl.checked) {
      sectionEl.classList.remove("hidden");
      sectionEl.classList.add("block");
    } else {
      sectionEl.classList.remove("black");
      sectionEl.classList.add("hidden");
    }
  });
};

const fixToggleCheckboxSection = (checkboxId: string, sectionId: string) => {
  const checkboxEl = document.getElementById(checkboxId) as HTMLInputElement;
  const sectionEl = document.getElementById(sectionId) as HTMLDivElement;

  if (checkboxEl.checked) {
    sectionEl.classList.remove("hidden");
    sectionEl.classList.add("block");
  } else {
    sectionEl.classList.remove("black");
    sectionEl.classList.add("hidden");
  }
};
