export const getFaviconURL = (url: string, userAgent: string) => {
  if (userAgent === "chrome") {
    // prettier-ignore
    return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${64}`;
  } else {
    // google version
    // return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=256`;

    // duckduckgo version
    return `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`;
  }
};
