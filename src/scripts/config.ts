import { icons } from "src/scripts/icons";

export const config: Config = {
  title: "mtab",
  animations: {
    enabled: "on",
    animationClass: "animate-up-bouncy"
  },
  user: {
    name: "Max"
  },
  search: {
    engine: "duckduckgo",
    focusedBorderClass: "border-blue-500",
    activationKey: " "
  },
  closePageKey: "x",
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
      iconSvg: icons.world,
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

export interface Config {
  title: string;
  animations: {
    enabled: "on" | "off";
    animationClass:
      | "animate-down-bouncy"
      | "animate-down-smooth"
      | "animate-up-bouncy"
      | "animate-up-smooth";
  };
  user: {
    name: string;
  };
  search: {
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
