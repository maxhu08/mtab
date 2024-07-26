export const getConfig = (f: ({ config }: { config: Config }) => void) => {
  chrome.storage.local.get(["config"], (data) => {
    if (Object.keys(data).length === 0) {
      chrome.storage.local.set({
        config: defaultConfig
      });

      f({
        config: defaultConfig
      });
      return;
    }

    f({
      config: data.config
    });
  });
};

export const defaultConfig: Config = {
  user: {
    name: "user"
  },
  title: {
    defaultTitle: "mtab",
    dynamic: {
      enabled: true
    }
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
    customCSS: "/* input custom css... */"
  },
  animations: {
    enabled: true,
    bookmarkTiming: "left",
    type: "animate-up-bouncy"
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
    ]
  }
};

export type UIStyle = "solid" | "glass";
export type WallpaperType = "url" | "fileUpload";
export type BookmarkTiming = "left" | "right" | "uniform";
export type AnimationType =
  | "animate-down-bouncy"
  | "animate-down-smooth"
  | "animate-down-fall"
  | "animate-up-bouncy"
  | "animate-up-smooth"
  | "animate-grow-scale";
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
export type BookmarksType = "user-defined" | "default" | "none";
export type UserDefinedBookmark = {
  name: string;
  url: string;
  color: string;
  iconType: string;
  iconColor: string;
};

export interface Config {
  user: {
    name: string;
  };
  title: {
    defaultTitle: string;
    dynamic: {
      enabled: boolean;
    };
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
    customCSS: string;
  };
  animations: {
    enabled: boolean;
    bookmarkTiming: BookmarkTiming;
    type: AnimationType;
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
    userDefined: UserDefinedBookmark[];
  };
}
