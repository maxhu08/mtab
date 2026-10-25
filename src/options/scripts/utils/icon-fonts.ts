export const loadIconFonts = () => import("../../styles/icon-fonts.css");

export const deferIconFonts = () => {
  // Let the ready options page paint before starting the large icon stylesheets.
  requestAnimationFrame(() => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(loadIconFonts, { timeout: 2000 });
    } else {
      setTimeout(loadIconFonts, 0);
    }
  });
};