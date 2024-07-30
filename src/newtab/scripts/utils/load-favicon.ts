import { FaviconType } from "src/newtab/scripts/config";

export const loadFavicon = (faviconType: FaviconType) => {
  if (faviconType !== "custom") return;

  chrome.storage.local.get(["userUploadedFavicon"], (data) => {
    const favicon = document.getElementById("favicon") as HTMLLinkElement;
    favicon.href = data.userUploadedFavicon as string;
  });
};
