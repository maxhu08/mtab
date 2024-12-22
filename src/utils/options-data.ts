import { deepMerge } from "src/utils/deep-merge";

const migrateOldOptionsData = (optionsData: OptionsData): OptionsData => {
  return optionsData;
};

export const getOptionsData = (f: ({ optionsData }: { optionsData: OptionsData }) => void) => {
  chrome.storage.local.get(["optionsData"], (data) => {
    if (Object.keys(data).length === 0) {
      chrome.storage.local.set({
        optionsData: structuredClone(defaultOptionsData)
      });

      f({
        optionsData: structuredClone(defaultOptionsData)
      });
      return;
    }

    // fill empty properties
    const mergedOptionsData = deepMerge(structuredClone(defaultOptionsData), data.optionsData);
    // migrate old optionsData to new version
    const finalizedOptionsData = migrateOldOptionsData(mergedOptionsData);

    f({
      optionsData: finalizedOptionsData
    });
  });
};

const defaultOptionsData: OptionsData = {
  sectionsExpanded: {
    options: true,
    user: true,
    title: true,
    message: true,
    wallpaper: true,
    ui: true,
    animations: true,
    search: true,
    hotkeys: true,
    bookmarks: true,
    extras: true
  }
};

export interface OptionsData {
  sectionsExpanded: {
    options: boolean;
    user: boolean;
    title: boolean;
    message: boolean;
    wallpaper: boolean;
    ui: boolean;
    animations: boolean;
    search: boolean;
    hotkeys: boolean;
    bookmarks: boolean;
    extras: boolean;
  };
}
