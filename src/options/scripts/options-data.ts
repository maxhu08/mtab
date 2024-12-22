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

export const deepMerge = (target: any, source: any): any => {
  const isObject = (obj: any) => obj && typeof obj === "object";

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMerge({ ...targetValue }, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
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
