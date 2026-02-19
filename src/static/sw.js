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
        const error = `Search suggestions request failed: HTTP ${res.status} ${res.statusText}`;
        console.error(error, { url });
        sendResponse({ ok: false, suggestions: [], error });
        return;
      }

      const data = await res.json();
      const suggestions = Array.isArray(data)
        ? data
            .map((item) => (typeof item === "string" ? item : item && item.phrase))
            .filter((s) => typeof s === "string")
        : [];

      sendResponse({ ok: true, suggestions });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      console.error("Search suggestions request threw an error", { q, error, err });
      sendResponse({ ok: false, suggestions: [], error });
    }
  })();

  return true;
});
