// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // w - warmup (stop cold start)
  // s - suggestion request

  if (!msg) return;

  if (msg.type === "w") {
    sendResponse({ ok: true });
    return;
  }

  if (msg.type !== "s") return;

  (async () => {
    const q = String(msg.q || "").trim();
    if (!q) {
      sendResponse({ ok: true, suggestions: [] });
      return;
    }

    try {
      const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if (!res.ok) {
        sendResponse({ ok: false, suggestions: [] });
        return;
      }

      const data = await res.json();
      const suggestions = Array.isArray(data)
        ? data
            .map((item) => (typeof item === "string" ? item : item && item.phrase))
            .filter((s) => typeof s === "string")
        : [];

      sendResponse({ ok: true, suggestions });
    } catch {
      sendResponse({ ok: false, suggestions: [] });
    }
  })();

  return true;
});
