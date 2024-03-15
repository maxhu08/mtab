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
    font: "Fira Code",
    type: "afternoon-morning",
    customText: "custom text test"
  },
  wallpaper: {
    enabled: true,
    url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.hdwallpapers.in%2Fdownload%2Freally_cool_landscape_wallpaper_4k_hd-HD.jpg&f=1&nofb=1&ipt=0c0009ff2f336ed3d94a204a1ecf8f401a7de711364a4497e7ec13597ae76ec2&ipo=images"
  },
  uiStyle: "glass",
  animations: {
    uniformBookmarkAnimations: false,
    enabled: true,
    animationClass: "animate-up-bouncy"
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
    uniformBookmarkAnimations: boolean;
    enabled: boolean;
    animationClass:
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
