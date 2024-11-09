export const getFaviconURL = (url: string, source: "duckduckgo" | "google") => {
  if (!url) return "";

  if (source === "duckduckgo") return `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`;
  else return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=256`;
};
