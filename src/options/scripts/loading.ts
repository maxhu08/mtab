// Keep this classic script import-free so the layout hint applies before the first paint.
(() => {
  const style = document.createElement("style");
  style.textContent = sessionStorage.getItem("options-layout");
  document.head.appendChild(style);

  const top = sessionStorage.getItem("options-scroll");
  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (top !== null && navigation?.type === "reload") {
    const restoration = history.scrollRestoration;
    const controller = new AbortController();
    let interrupted = false;

    history.scrollRestoration = "manual";

    ["wheel", "touchmove", "pointerdown", "keydown"].forEach((event) => {
      window.addEventListener(event, () => (interrupted = true), {
        passive: true,
        signal: controller.signal
      });
    });

    const restore = () => {
      if (!interrupted) window.scrollTo({ top: Number(top), behavior: "instant" });
    };

    document.addEventListener("DOMContentLoaded", restore, { once: true });
    window.addEventListener(
      "options-ready",
      () => {
        restore();
        history.scrollRestoration = restoration;
        controller.abort();
      },
      { once: true }
    );
  }

  window.addEventListener("pagehide", () => {
    // A refresh during initialization must not replace the last settled layout.
    if (document.documentElement.classList.contains("options-initializing")) return;

    sessionStorage.setItem(
      "options-layout",
      `:root.options-initializing body { min-height: ${document.documentElement.scrollHeight}px !important; }\n` +
        Array.from(document.querySelectorAll(".options-page-layout [id]"))
          .map((el) => {
            const height =
              el.tagName === "SECTION"
                ? `height: ${el.getBoundingClientRect().height}px !important;`
                : "";

            return `:root.options-initializing #${CSS.escape(el.id)} { display: ${getComputedStyle(el).display} !important; ${height} }`;
          })
          .join("\n")
    );
    sessionStorage.setItem("options-scroll", String(window.scrollY));
  });
})();