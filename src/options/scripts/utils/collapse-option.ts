import { getOptionsData } from "~/src/utils/options-data";
import { modifyNestedObject } from "~/src/utils/modify";

export const createCollapseGroups = () => {
  getOptionsData(({ optionsData }) => {
    const sectionsExpanded = optionsData.sectionsExpanded;

    newCollapseGroup("options-collapse-button", "options-section", sectionsExpanded.options);
    newCollapseGroup("user-collapse-button", "user-section", sectionsExpanded.user);
    newCollapseGroup("title-collapse-button", "title-section", sectionsExpanded.title);
    newCollapseGroup("message-collapse-button", "message-section", sectionsExpanded.message);
    newCollapseGroup("wallpaper-collapse-button", "wallpaper-section", sectionsExpanded.wallpaper);
    newCollapseGroup("ui-collapse-button", "ui-section", sectionsExpanded.ui);
    newCollapseGroup(
      "animations-collapse-button",
      "animations-section",
      sectionsExpanded.animations
    );
    newCollapseGroup("search-collapse-button", "search-section", sectionsExpanded.search);
    newCollapseGroup("hotkeys-collapse-button", "hotkeys-section", sectionsExpanded.hotkeys);
    newCollapseGroup("bookmarks-collapse-button", "bookmarks-section", sectionsExpanded.bookmarks);
    newCollapseGroup("extras-collapse-button", "extras-section", sectionsExpanded.extras);
  });
};

export const collapseOptionSection = (optionSection: HTMLElement) => {
  optionSection.classList.replace("grid", "hidden");
};

export const expandOptionSection = (optionSection: HTMLElement) => {
  optionSection.classList.replace("hidden", "grid");
};

export const bindCollapseOptionButton = (
  collapseButton: HTMLButtonElement,
  optionSection: HTMLElement
) => {
  collapseButton.addEventListener("click", () => {
    if (optionSection.classList.contains("grid")) {
      collapseButton.children[0].className = "ri-expand-horizontal-s-line";
      collapseOptionSection(optionSection);
    } else {
      collapseButton.children[0].className = "ri-collapse-horizontal-line";
      expandOptionSection(optionSection);
    }

    getOptionsData(({ optionsData }) => {
      const draft = modifyNestedObject(optionsData, (draft) => {
        // prettier-ignore
        const sectionKey = optionSection.id.split("-")[0] as keyof typeof optionsData.sectionsExpanded;
        draft.sectionsExpanded[sectionKey] = optionSection.classList.contains("grid");

        return draft;
      });

      chrome.storage.local.set({
        optionsData: draft
      });
    });
  });
};

export const newCollapseGroup = (buttonId: string, sectionId: string, expanded: boolean) => {
  const collapseButton = document.getElementById(buttonId) as HTMLButtonElement;
  const optionSection = document.getElementById(sectionId) as HTMLElement;

  bindCollapseOptionButton(collapseButton, optionSection);
  if (!expanded) collapseButton.click();
};
