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
  title: "new tab",
  dynamicTitle: { enabled: true }, // changes when typing in search bar
  message: {
    font: `"Fira Code"`,
    type: "afternoon-morning",
    customText: "custom text test"
  },
  wallpaper: {
    enabled: true,
    url: "./wallpapers/bg-1.png"
  },
  uiStyle: "glass",
  animations: {
    enabled: true,
    uniformBookmarkAnimations: false,
    type: "animate-up-bouncy"
  },
  search: {
    font: "Fira Code",
    placeholderText: "search...",
    engine: "duckduckgo",
    focusedBorderClass: "border-blue-500",
    activationKey: " "
  },
  closePageKey: "x",
  // TODO: bookmarks activation key
  bookmarks: [
    {
      name: "github",
      url: "https://github.com",
      iconSvg: icons.github,
      colorClass: "bg-indigo-500",
      activationKey: "g"
    },
    {
      name: "youtube",
      url: "https://youtube.com",
      iconSvg: icons.youtube,
      colorClass: "bg-red-500",
      activationKey: "y"
    },
    {
      name: "studio",
      url: "https://studio.youtube.com",
      iconSvg: icons.gear,
      colorClass: "bg-red-500",
      activationKey: "y"
    },
    {
      name: "lh3000",
      url: "http://localhost:3000",
      iconSvg: icons.world,
      colorClass: "bg-teal-500",
      activationKey: "l"
    }
  ]
};

export type UIStyle = "solid" | "glass";

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
    type: "afternoon-morning" | "date" | "time-12" | "time-24" | "custom";
    customText: string;
  };
  wallpaper: {
    enabled: boolean;
    url: string;
  };
  uiStyle: UIStyle;
  animations: {
    enabled: boolean;
    uniformBookmarkAnimations: boolean;
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
    engine: "google" | "duckduckgo" | "bing";
    focusedBorderClass: string;
    activationKey: string;
  };
  closePageKey: string;
  bookmarks: {
    name: string;
    url: string;
    iconSvg: string;
    colorClass: string;
    activationKey: string;
  }[];
}
