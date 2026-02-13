export const insertCSS = (css: string, styleId?: string) => {
  if (styleId) {
    const existingStyleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    if (existingStyleElement) {
      if (existingStyleElement.textContent !== css) {
        existingStyleElement.textContent = css;
      }
      return;
    }
  }

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (styleId) styleElement.id = styleId;
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};
