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
    url: "./wallpapers/bg-1.png"
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
    font: "Fira Code",
    placeholderText: "search...",
    engine: "duckduckgo",
    focusedBorderColor: "red"
  },
  hotkeys: {
    enabled: true,
    activationKey: " ",
    closePageKey: "x"
  },
  bookmarks: [
    {
      name: "github",
      url: "https://github.com",
      iconType: "github",
      color: "purple"
    },
    {
      name: "youtube",
      url: "https://youtube.com",
      iconType: "youtube",
      color: "red"
    },
    {
      name: "studio",
      url: "https://studio.youtube.com",
      iconType: "gear",
      color: "red"
    },
    {
      name: "lh3000",
      url: "http://localhost:3000",
      iconType: "world",
      color: "blue"
    }
  ]
};

export type UIStyle = "solid" | "glass";
export type WallpaperType = "url" | "fileUpload";
export type BookmarkTiming = "left" | "right" | "uniform";
export type SearchEngine = "duckduckgo" | "google" | "bing" | "yahoo";
export type MessageType = "afternoon-morning" | "date" | "time-12" | "time-24" | "custom";
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
  bookmarks: Bookmark[];
}
