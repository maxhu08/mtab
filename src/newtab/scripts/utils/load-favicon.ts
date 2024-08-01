import { FaviconType } from "src/newtab/scripts/config";

export const loadFavicon = (faviconType: FaviconType) => {
  if (faviconType !== "custom") {
    document.head.innerHTML += `<link id="favicon" rel="icon" href="favicon.ico" type="image/x-icon">`;
    return;
  }

  chrome.storage.local.get(["userUploadedFavicon"], (data) => {
    document.head.innerHTML += `<link id="favicon" rel="icon" href="${data.userUploadedFavicon}" type="image/x-icon">`;
  });
};
