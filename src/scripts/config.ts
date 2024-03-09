export const config: Config = {
  title: "mtab",
  user: {
    name: "Max"
  },
  search: {
    engine: "duckduckgo",
    focusedBorderClass: "border-blue-500",
    activationKey: " "
  },
  bookmarks: []
};

interface Config {
  title: string;
  user: {
    name: string;
  };
  search: {
    engine: "google" | "duckduckgo" | "bing";
    focusedBorderClass: string;
    activationKey: string;
  };
  bookmarks: {
    name: string;
    url: string;
    activationKey: string;
  }[];
}
