export const getConfig = (f: ({ config }: { config: Config }) => void) => {
  chrome.storage.local.get(["config"], (data) => {
    if (Object.keys(data).length === 0) {
      chrome.storage.local.set({
        config: structuredClone(defaultConfig)
      });

      f({
        config: structuredClone(defaultConfig)
      });
      return;
    }

    // fill empty properties
    const mergedConfig = deepMerge(structuredClone(defaultConfig), data.config);

    f({
      config: mergedConfig
    });
  });
};

const deepMerge = (target: any, source: any): any => {
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

export const defaultConfig: Config = {
  user: {
    name: "user"
  },
  title: {
    defaultTitle: "mtab",
    dynamic: {
      enabled: true
    },
    faviconType: "default"
  },
  message: {
    enabled: true,
    font: `"Jetbrains-Mono-Regular-Fixed"`,
    textColor: "#ffffff",
    type: "afternoon-morning",
    customText: "your custom text"
  },
  wallpaper: {
    type: "url",
    enabled: true,
    // url: `chrome-extension://${chrome.runtime.id}/wallpapers/bg-1.png`
    url: `./wallpapers/bg-1.png`
  },
  ui: {
    style: "glass",
    foregroundColor: "#262626",
    backgroundColor: "#171717",
    highlightColor: "#ffffff20",
    cornerStyle: "round",
    customCSS: "/* input custom css... */"
  },
  animations: {
    enabled: true,
    bookmarkTiming: "left",
    initialType: "animate-up-bouncy",
    searchType: "animate-page-shrink",
    bookmarkType: "animate-page-down"
  },
  search: {
    enabled: true,
    font: `"Jetbrains-Mono-Regular-Fixed"`,
    textColor: "#ffffff",
    placeholderText: "search...",
    bookmarkPlaceholderText: "find bookmark...",
    placeholderTextColor: "#a1a1aa",
    searchIconColor: "#14b8a6",
    bookmarkIconColor: "#3b82f6",
    selectIconColor: "#f59e0b",
    engine: "duckduckgo",
    useCustomEngine: false,
    customEngineURL: "",
    focusedBorderColor: "#0ea5e9"
  },
  hotkeys: {
    enabled: true,
    activationKey: " ",
    closePageKey: "x",
    searchBookmarksKey: "b"
  },
  bookmarks: {
    type: "user-defined",
    userDefinedCols: 4,
    userDefined: [
      {
        name: "github",
        url: "https://github.com",
        color: "#6366f1",
        iconType: "ri-github-fill",
        iconColor: "#ffffff"
      },
      {
        name: "youtube",
        url: "https://youtube.com",
        color: "#f43f5e",
        iconType: "ri-youtube-fill",
        iconColor: "#ffffff"
      },
      {
        name: "reddit",
        url: "https://www.reddit.com",
        color: "#f97316",
        iconType: "ri-reddit-fill",
        iconColor: "#ffffff"
      },
      {
        name: "localhost",
        url: "http://localhost:3000",
        color: "#14b8a6",
        iconType: "ri-global-fill",
        iconColor: "#ffffff"
      }
    ],
    defaultBlockyCols: 4,
    defaultBlockyColor: "#ffffff",
    showBookmarkNames: false,
    bookmarksLocationFirefox: "toolbar"
  }
};

export type FaviconType = "default" | "custom";
export type UIStyle = "solid" | "glass";
export type UICornerStyle = "sharp" | "round";
export type WallpaperType = "url" | "fileUpload";
export type BookmarkTiming = "left" | "right" | "uniform";
export type AnimationInitialType =
  | "animate-down-bouncy"
  | "animate-down-smooth"
  | "animate-down-fall"
  | "animate-up-bouncy"
  | "animate-up-smooth"
  | "animate-grow-scale"
  | "animate-fly-left"
  | "animate-fly-right";
export type AnimationSearchType =
  | "animate-page-shrink"
  | "animate-page-scale"
  | "animate-page-up"
  | "animate-page-down";
export type AnimationBookmarkType =
  | "animate-page-shrink"
  | "animate-page-scale"
  | "animate-page-up"
  | "animate-page-down";
export type SearchEngine =
  | "duckduckgo"
  | "google"
  | "bing"
  | "brave"
  | "yahoo"
  | "yandex"
  | "startpage"
  | "ecosia";
export type MessageType = "afternoon-morning" | "date" | "time-12" | "time-24" | "custom";
export type BookmarksType = "user-defined" | "default" | "default-blocky" | "none";
export type UserDefinedBookmark = {
  name: string;
  url: string;
  color: string;
  iconType: string;
  iconColor: string;
};
export type BookmarksLocationFirefox = "menu" | "toolbar" | "other";

export interface Config {
  user: {
    name: string;
  };
  title: {
    defaultTitle: string;
    dynamic: {
      enabled: boolean;
    };
    faviconType: FaviconType;
  };
  message: {
    enabled: boolean;
    font: string;
    textColor: string;
    type: MessageType;
    customText: string;
  };
  wallpaper: {
    type: WallpaperType;
    enabled: boolean;
    url: string;
  };
  ui: {
    style: UIStyle;
    foregroundColor: string;
    backgroundColor: string;
    highlightColor: string;
    cornerStyle: UICornerStyle;
    customCSS: string;
  };
  animations: {
    enabled: boolean;
    bookmarkTiming: BookmarkTiming;
    initialType: AnimationInitialType;
    searchType: AnimationSearchType;
    bookmarkType: AnimationBookmarkType;
  };
  search: {
    enabled: boolean;
    font: string;
    textColor: string;
    placeholderText: string;
    bookmarkPlaceholderText: string;
    placeholderTextColor: string;
    searchIconColor: string;
    bookmarkIconColor: string;
    selectIconColor: string;
    engine: SearchEngine;
    useCustomEngine: boolean;
    customEngineURL: string;
    focusedBorderColor: string;
  };
  hotkeys: {
    enabled: boolean;
    activationKey: string;
    closePageKey: string;
    searchBookmarksKey: string;
  };
  bookmarks: {
    type: BookmarksType;
    userDefinedCols: number;
    userDefined: UserDefinedBookmark[];
    defaultBlockyCols: number;
    defaultBlockyColor: string;
    showBookmarkNames: boolean;
    bookmarksLocationFirefox: BookmarksLocationFirefox;
  };
}
