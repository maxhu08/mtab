console.log("[sw] init");

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  const type = String(msg?.type ?? "");
  const isDDG = type === "suggestions:duckduckgo";
  const isGoogle = type === "suggestions:google";
  if (!isDDG && !isGoogle) return;

  (async () => {
    const q = String(msg.q ?? "").trim();
    if (!q) return sendResponse({ ok: true, suggestions: [] });

    try {
      if (isDDG) {
        const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}`;
        const res = await fetch(url);
        if (!res.ok) return sendResponse({ ok: false, suggestions: [] });

        const data = await res.json();
        const suggestions = Array.isArray(data)
          ? data
              .map((item) => (typeof item === "string" ? item : item?.phrase))
              .filter((s) => typeof s === "string")
          : [];

        return sendResponse({ ok: true, suggestions });
      }

      // google
      const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if (!res.ok) return sendResponse({ ok: false, suggestions: [] });

      const data = await res.json();
      const suggestions =
        Array.isArray(data) && Array.isArray(data[1])
          ? data[1].filter((s) => typeof s === "string")
          : [];

      return sendResponse({ ok: true, suggestions });
    } catch (e) {
      console.log("[sw] error:", e);
      return sendResponse({ ok: false, suggestions: [] });
    }
  })();

  return true;
});
