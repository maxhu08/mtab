export const getFaviconURL = (url: string, userAgent: string) => {
  if (userAgent === "chrome") {
    // prettier-ignore
    return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${64}`;
  } else {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=256`;
  }
};
