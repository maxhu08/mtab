import { FaviconType } from "~/src/utils/config";

export const loadFavicon = (faviconType: FaviconType) => {
  if (faviconType !== "custom") {
    const defaultFavicon = document.createElement("link");
    defaultFavicon.id = "favicon";
    defaultFavicon.rel = "icon";
    defaultFavicon.href = "favicon.ico";
    defaultFavicon.type = "image/x-icon";
    document.head.appendChild(defaultFavicon);
    return;
  }

  chrome.storage.local.get(["userUploadedFavicon"], (data) => {
    const customFavicon = document.createElement("link");
    customFavicon.id = "favicon";
    customFavicon.rel = "icon";
    customFavicon.href =
      typeof data.userUploadedFavicon === "string" ? data.userUploadedFavicon : "";
    customFavicon.type = "image/x-icon";
    document.head.appendChild(customFavicon);
  });
};
