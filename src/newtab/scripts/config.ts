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
    name: "Default"
  },
  title: {
    defaultTitle: "mtab",
    dynamic: {
      enabled: true
    }
  },
  message: {
    font: `"Fira Code"`,
    type: "afternoon-morning",
    customText: "custom text test"
  },
  wallpaper: {
    type: "url",
    enabled: true,
    url: `chrome-extension://${chrome.runtime.id}/wallpapers/bg-1.png`
  },
  ui: {
    style: "glass",
    foregroundColor: "#262626",
    backgroundColor: "#171717",
    highlightColor: "#00ffff20"
  },
  animations: {
    enabled: true,
    bookmarkTiming: "left",
    type: "animate-up-bouncy"
  },
  search: {
    font: `"Fira Code"`,
    placeholderText: "search...",
    engine: "duckduckgo",
    focusedBorderColor: "red"
  },
  hotkeys: {
    enabled: true,
    activationKey: " ",
    closePageKey: "x"
  },
  bookmarks: {
    type: "user-defined",
    userDefined: [
      {
        name: "github",
        url: "https://github.com",
        iconType: "ri-github-fill",
        color: "#6366f1"
      },
      {
        name: "youtube",
        url: "https://youtube.com",
        iconType: "ri-youtube-fill",
        color: "#f43f5e"
      },
      {
        name: "studio",
        url: "https://www.reddit.com/",
        iconType: "ri-reddit-fill",
        color: "#f97316"
      },
      {
        name: "lh3000",
        url: "http://localhost:3000",
        iconType: "ri-global-fill",
        color: "#14b8a6"
      }
    ]
  }
};

export type UIStyle = "solid" | "glass";
export type WallpaperType = "url" | "fileUpload";
export type BookmarkTiming = "left" | "right" | "uniform";
export type SearchEngine = "duckduckgo" | "google" | "bing" | "yahoo";
export type MessageType = "afternoon-morning" | "date" | "time-12" | "time-24" | "custom";
export type BookmarksType = "user-defined" | "default" | "none";
export type Bookmark = {
  name: string;
  url: string;
  iconType: string;
  color: string;
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
    font: string;
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
  };
  animations: {
    enabled: boolean;
    bookmarkTiming: BookmarkTiming;
    type:
      | "animate-down-bouncy"
      | "animate-down-smooth"
      | "animate-down-fall"
      | "animate-up-bouncy"
      | "animate-up-smooth";
  };
  search: {
    font: string;
    placeholderText: string;
    engine: SearchEngine;
    focusedBorderColor: string;
  };
  hotkeys: {
    enabled: boolean;
    activationKey: " ";
    closePageKey: "x";
  };
  bookmarks: {
    type: BookmarksType;
    userDefined: Bookmark[];
  };
}
