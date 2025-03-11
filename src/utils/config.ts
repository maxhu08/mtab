import { deepMerge } from "src/utils/deep-merge";

export const migrateOldConfig = (config: Config): Config => {
  // if config is before v1.6.5
  // prettier-ignore
  if (typeof config.message.font === "string") config.message.font = { type: "default", custom: "" };
  if (typeof config.search.font === "string") config.search.font = { type: "default", custom: "" };

  // if config is before v.1.6.7
  // add 'type' property to user-defined bookmarks
  if (config.bookmarks.userDefined) {
    config.bookmarks.userDefined = config.bookmarks.userDefined.map((node: any) => {
      if (!node.type) {
        if ("url" in node) return { ...node, type: "bookmark" }; // add type for bookmarks
        if ("contents" in node) return { ...node, type: "folder" }; // add type for folders
      }
      return node;
    });
  }

  // if config is before v1.6.8
  // replace userDefinedKeys with numberKeys
  if ("userDefinedKeys" in config.bookmarks) {
    // ensure userDefinedKeys is a boolean
    config.bookmarks.numberKeys = !!config.bookmarks.userDefinedKeys;
    delete config.bookmarks.userDefinedKeys;
  }

  // if config is before v1.8.0
  // ensure 'fill' property exists for user-defined bookmarks
  if (config.bookmarks.userDefined) {
    config.bookmarks.userDefined = config.bookmarks.userDefined.map((node: any) => {
      const stack = [node];

      while (stack.length) {
        const current = stack.pop();

        if (
          ((current.type === "bookmark" || current.type === "folder") && !("fill" in current)) ||
          current.fill === "undefined"
        ) {
          current.fill = "";
        }

        if (current.type === "folder" && Array.isArray(current.contents)) {
          stack.push(...current.contents);
        }
      }

      return node;
    });
  }

  // if config is before v1.8.3
  // remove the resize property from wallpaper
  if (config.wallpaper && (config as any).wallpaper.resize) {
    delete (config as any).wallpaper.resize;
  }

  // if config is before v1.8.3
  // ensure 'blur' and 'brightness' properties exist for wallpaper.filter
  if (!config.wallpaper.filters.blur) config.wallpaper.filters.blur = "0px";
  if (!config.wallpaper.filters.brightness) config.wallpaper.filters.brightness = "1";

  return config;
};

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
    type: "url",
    enabled: true,
    // url: `chrome-extension://${chrome.runtime.id}/wallpapers/bg-1.png`
    url: `./wallpapers/bg-1.png`,
    filters: {
      brightness: "1",
      blur: "0px"
    }
  },
  ui: {
    style: "glass",
    glassColor: "#ffffff20",
    blurStrength: "32px",
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
    engine: "duckduckgo",
    useCustomEngine: false,
    customEngineURL: "",
    focusedBorderColor: "#0ea5e9",
    assist: {
      // history: false,
      date: true,
      math: true,
      definitions: true,
      conversions: true
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
    numberKeys: false,
    userDefinedCols: 4,
    lineOrientation: "top",
    userDefined: [
      {
        type: "bookmark",
        name: "github",
        url: "https://github.com",
        color: "#6366f1",
        iconType: "ri-github-fill",
        // extra options
        iconColor: "#ffffff",
        fill: ""
      },
      {
        type: "bookmark",
        name: "youtube",
        url: "https://youtube.com",
        color: "#f43f5e",
        iconType: "ri-youtube-fill",
        // extra options
        iconColor: "#ffffff",
        fill: ""
      },
      {
        type: "bookmark",
        name: "reddit",
        url: "https://www.reddit.com",
        color: "#f97316",
        iconType: "ri-reddit-fill",
        // extra options
        iconColor: "#ffffff",
        fill: ""
      },
      {
        type: "bookmark",
        name: "chatgpt",
        url: "https://chatgpt.com",
        color: "#14b8a6",
        iconType: "ri-openai-fill",
        // extra options
        iconColor: "#ffffff",
        fill: ""
      }
    ],
    defaultFolderIconType: "ri-folder-fill",
    defaultBlockyCols: 4,
    defaultBlockyColorType: "custom",
    defaultBlockyColor: "#ffffff",
    defaultFaviconSource: "duckduckgo",
    showBookmarkNames: false,
    bookmarksLocationFirefox: "toolbar"
  },
  extras: {
    snow: {
      enabled: "off"
    }
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
  iconColor: string;
  fill: string;
  contents: BookmarkNode[];
};
export type BookmarkNodeBookmark = {
  type: "bookmark";
  name: string;
  url: string;
  color: string;
  iconType: string;
  // extra options
  iconColor: string;
  fill: string;
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
  };
  ui: {
    style: UIStyle;
    blurStrength: string;
    glassColor: string;
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
    engine: SearchEngine;
    useCustomEngine: boolean;
    customEngineURL: string;
    focusedBorderColor: string;
    assist: {
      // history: boolean;
      date: boolean;
      math: boolean;
      definitions: boolean;
      conversions: boolean;
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
    numberKeys: boolean;
    userDefinedCols: number;
    lineOrientation: BookmarkLineOrientation;
    userDefined: BookmarkNode[];
    defaultFolderIconType: string;
    defaultBlockyCols: number;
    defaultBlockyColorType: DefaultBlockyColorType;
    defaultBlockyColor: string;
    defaultFaviconSource: DefaultFaviconSource;
    showBookmarkNames: boolean;
    bookmarksLocationFirefox: BookmarksLocationFirefox;
  };
  extras: {
    snow: {
      enabled: SnowEnabledType;
    };
  };
}
