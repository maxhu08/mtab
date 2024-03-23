import { icons } from "./icons";

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
  title: "mtab",
  dynamicTitle: { enabled: true }, // changes when typing in search bar
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
    backgroundColor: "#171717"
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
    activationKey: " ",
    closePageKey: "x"
  },
  // TODO: bookmarks activation key
  bookmarks: [
    {
      name: "github",
      url: "https://github.com",
      iconType: "github",
      colorClass: "bg-indigo-500",
      activationKey: "g"
    },
    {
      name: "youtube",
      url: "https://youtube.com",
      iconType: "youtube",
      colorClass: "bg-red-500",
      activationKey: "y"
    },
    {
      name: "studio",
      url: "https://studio.youtube.com",
      iconType: "gear",
      colorClass: "bg-red-500",
      activationKey: "y"
    },
    {
      name: "lh3000",
      url: "http://localhost:3000",
      iconType: "world",
      colorClass: "bg-teal-500",
      activationKey: "l"
    }
  ]
};

export type UIStyle = "solid" | "glass";
export type WallpaperType = "url" | "fileUpload";
export type BookmarkTiming = "left" | "right" | "uniform";
export type SearchEngine = "duckduckgo" | "google" | "bing" | "yahoo";
export type MessageType = "afternoon-morning" | "date" | "time-12" | "time-24" | "custom";

export interface Config {
  user: {
    name: string;
  };
  title: string;
  dynamicTitle: {
    enabled: boolean;
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
    activationKey: " ";
    closePageKey: "x";
  };
  bookmarks: {
    name: string;
    url: string;
    iconType: string;
    colorClass: string;
    activationKey: string;
  }[];
}
