import { deepMerge } from "src/utils/deep-merge";
import { migrateOldConfig } from "src/utils/migrate-config";

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
    // migrate old config to new version
    const finalizedConfig = migrateOldConfig(mergedConfig);

    f({
      config: finalizedConfig
    });
  });
};

export const defaultConfig: Config = {
  options: {
    showOptionsButton: true
  },
  user: {
    name: "user"
  },
  title: {
    defaultTitle: "mtab",
    dynamic: {
      enabled: true
    },
    effect: "none",
    typewriter: {
      speed: 500,
      remainCount: 1
    },
    faviconType: "default"
  },
  message: {
    enabled: true,
    font: {
      type: "default",
      custom: ""
    },
    textColor: "#ffffff",
    textSize: 3.75,
    type: "afternoon-morning",
    customText: "your custom text",
    weather: {
      unitsType: "f"
    }
  },
  wallpaper: {
    type: "default",
    enabled: true,
    url: "",
    filters: {
      brightness: "1",
      blur: "0px"
    },
    solidColor: "#171717"
  },
  ui: {
    style: "glass",
    glassColor: "#ffffff20",
    blurStrength: "32px",
    foregroundColor: "#262626",
    highlightColor: "#ffffff20",
    cornerStyle: "round",
    customCSS: "/* input custom css... */"
  },
  animations: {
    enabled: true,
    bookmarkTiming: "left",
    initialType: "animate-up-bouncy",
    searchType: "animate-page-shrink",
    bookmarkType: "animate-page-up"
  },
  search: {
    enabled: true,
    font: {
      type: "default",
      custom: ""
    },
    textColor: "#ffffff",
    placeholderText: "search...",
    bookmarkPlaceholderText: "find bookmark...",
    placeholderTextColor: "#a1a1aa",
    searchIconColor: "#14b8a6",
    bookmarkIconColor: "#3b82f6",
    selectIconColor: "#f59e0b",
    recognizeLinks: true,
    linkTextColor: "#0ea5e9",
    engine: "duckduckgo",
    useCustomEngine: false,
    customEngineURL: "",
    focusedBorderColor: "#0ea5e9",
    suggestions: true,
    assist: {
      date: true,
      math: true,
      definitions: true,
      conversions: true,
      passwordGenerator: true
    }
  },
  hotkeys: {
    enabled: true,
    activationKey: " ",
    closePageKey: "x",
    searchBookmarksKey: "b"
  },
  bookmarks: {
    type: "user-defined",
    showBookmarkNames: false,
    numberKeys: false,
    lineOrientation: "top",
    defaultIconColor: "#ffffff",
    defaultFolderIconType: "ri-folder-fill",
    userDefinedCols: 4,
    userDefined: [
      {
        type: "bookmark",
        name: "github",
        url: "https://github.com",
        color: "#6366f1",
        iconType: "ri-github-fill"
        // extra options
        // iconColor: "#ffffff",
        // fill: ""
      },
      {
        type: "bookmark",
        name: "youtube",
        url: "https://youtube.com",
        color: "#f43f5e",
        iconType: "ri-youtube-fill"
        // extra options
        // iconColor: "#ffffff",
        // fill: ""
      },
      {
        type: "bookmark",
        name: "reddit",
        url: "https://www.reddit.com",
        color: "#f97316",
        iconType: "ri-reddit-fill"
        // extra options
        // iconColor: "#ffffff",
        // fill: ""
      },
      {
        type: "bookmark",
        name: "chatgpt",
        url: "https://chatgpt.com",
        color: "#14b8a6",
        iconType: "ri-openai-fill"
        // extra options
        // iconColor: "#ffffff",
        // fill: ""
      }
    ],
    defaultBlockyCols: 4,
    defaultBlockyColorType: "custom",
    defaultBlockyColor: "#ffffff",
    bookmarksLocationFirefox: "toolbar",
    defaultFaviconSource: "duckduckgo"
  },
  extras: {
    snow: {
      enabled: "off"
    }
  }
};

export type TitleEffectType = "none" | "typewriter";
export type FaviconType = "default" | "custom";
export type UIStyle = "solid" | "glass";
export type UICornerStyle = "sharp" | "round";
export type WallpaperType = "url" | "file-upload" | "solid-color" | "default";
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
  | "ecosia"
  | "kagi";
export type MessageType =
  | "afternoon-morning"
  | "date"
  | "time-12"
  | "time-24"
  | "weather"
  | "custom";
export type BookmarkLineOrientation = "top" | "bottom" | "left" | "right" | "none";
export type BookmarksType = "user-defined" | "default" | "default-blocky" | "none";
export type BookmarkNode = BookmarkNodeFolder | BookmarkNodeBookmark;
export type BookmarkNodeFolder = {
  type: "folder";
  name: string;
  color: string;
  iconType?: string;
  iconColor?: string;
  fill?: string;
  contents: BookmarkNode[];
};
export type BookmarkNodeBookmark = {
  type: "bookmark";
  name: string;
  url: string;
  color: string;
  iconType: string;
  // extra options
  iconColor?: string;
  fill?: string;
};
export type DefaultBlockyColorType = "random" | "custom";
export type DefaultFaviconSource = "google" | "duckduckgo";
export type BookmarksLocationFirefox = "menu" | "toolbar" | "other";
export type FontType = "default" | "custom";
export type SnowEnabledType = "on" | "off" | "winter";

export interface Config {
  options: {
    showOptionsButton: boolean;
  };
  user: {
    name: string;
  };
  title: {
    defaultTitle: string;
    dynamic: {
      enabled: boolean;
    };
    effect: TitleEffectType;
    typewriter: {
      speed: number;
      remainCount: number;
    };
    faviconType: FaviconType;
  };
  message: {
    enabled: boolean;
    font: {
      type: FontType;
      custom: string;
    };
    textColor: string;
    textSize: number;
    type: MessageType;
    customText: string;
    weather: {
      unitsType: "f" | "c";
    };
  };
  wallpaper: {
    type: WallpaperType;
    enabled: boolean;
    url: string;
    filters: {
      brightness: string;
      blur: string;
    };
    solidColor: string;
  };
  ui: {
    style: UIStyle;
    blurStrength: string;
    glassColor: string;
    foregroundColor: string;
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
    font: {
      type: FontType;
      custom: string;
    };
    textColor: string;
    placeholderText: string;
    bookmarkPlaceholderText: string;
    placeholderTextColor: string;
    searchIconColor: string;
    bookmarkIconColor: string;
    selectIconColor: string;
    recognizeLinks: boolean;
    linkTextColor: string;
    engine: SearchEngine;
    useCustomEngine: boolean;
    customEngineURL: string;
    focusedBorderColor: string;
    suggestions: boolean;
    assist: {
      date: boolean;
      math: boolean;
      definitions: boolean;
      conversions: boolean;
      passwordGenerator: boolean;
    };
  };
  hotkeys: {
    enabled: boolean;
    activationKey: string;
    closePageKey: string;
    searchBookmarksKey: string;
  };
  bookmarks: {
    type: BookmarksType;
    showBookmarkNames: boolean;
    numberKeys: boolean;
    userDefinedCols: number;
    lineOrientation: BookmarkLineOrientation;
    defaultIconColor: string;
    defaultFolderIconType: string;
    userDefined: BookmarkNode[];
    defaultBlockyCols: number;
    defaultBlockyColorType: DefaultBlockyColorType;
    defaultBlockyColor: string;
    bookmarksLocationFirefox: BookmarksLocationFirefox;
    defaultFaviconSource: DefaultFaviconSource;
  };
  extras: {
    snow: {
      enabled: SnowEnabledType;
    };
  };
}
