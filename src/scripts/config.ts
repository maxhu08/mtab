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
      activationKey: "g"
    },
    {
      name: "youtube",
      url: "https://youtube.com",
      activationKey: "y"
    },
    {
      name: "studio",
      url: "https://studio.youtube.com",
      activationKey: "y"
    },
    {
      name: "lh3000",
      url: "http://localhost:3000",
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
    activationKey: string;
  }[];
}
