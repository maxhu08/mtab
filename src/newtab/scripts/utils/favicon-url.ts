export const getFaviconURL = (url: string, userAgent: string) => {
  const fUrl = new URL(chrome.runtime.getURL("/_favicon/"));
  fUrl.searchParams.set("pageUrl", encodeURIComponent(url));
  fUrl.searchParams.set("size", "64");

  if (userAgent === "firefox") {
    return `${new URL(url).origin}/favicon.ico`;
  } else {
    // prettier-ignore
    return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${64}`;
  }
};
