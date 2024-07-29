import { Config } from "src/newtab/scripts/config";

export const loadFavicon = (config: Config) => {
  if (config.title.faviconType !== "custom") return;

  chrome.storage.local.get(["userUploadedFavicon"], (data) => {
    const favicon = document.getElementById("favicon") as HTMLLinkElement;
    favicon.href = data.userUploadedFavicon as string;
  });
};
