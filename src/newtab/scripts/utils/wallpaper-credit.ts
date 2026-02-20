const wallpaperCreditAnchorEl = document.getElementById(
  "wallpaper-credit-anchor"
) as HTMLDivElement | null;
const wallpaperCreditTextEl = document.getElementById(
  "wallpaper-credit-text"
) as HTMLAnchorElement | null;
const CREDIT_PERSIST_MS = 10000;

let creditInitialized = false;
let hideCreditTimeout: number | undefined;

const showCredit = () => {
  if (!wallpaperCreditAnchorEl) return;

  if (hideCreditTimeout) {
    globalThis.clearTimeout(hideCreditTimeout);
    hideCreditTimeout = undefined;
  }

  wallpaperCreditAnchorEl.classList.add("shown");
};

const scheduleCreditHide = () => {
  if (!wallpaperCreditAnchorEl) return;

  if (hideCreditTimeout) {
    globalThis.clearTimeout(hideCreditTimeout);
  }

  hideCreditTimeout = globalThis.setTimeout(() => {
    wallpaperCreditAnchorEl.classList.remove("shown");
  }, CREDIT_PERSIST_MS);
};

const initCreditHoverBehavior = () => {
  if (!wallpaperCreditAnchorEl || creditInitialized) return;

  creditInitialized = true;

  wallpaperCreditAnchorEl.addEventListener("mouseenter", () => {
    showCredit();
  });

  wallpaperCreditAnchorEl.addEventListener("mouseleave", () => {
    scheduleCreditHide();
  });
};

export const setWallpaperCreditTheme = ({
  foregroundColor,
  searchTextColor
}: {
  foregroundColor: string;
  searchTextColor: string;
}) => {
  if (!wallpaperCreditTextEl) return;

  wallpaperCreditTextEl.classList.add("font-search");
  wallpaperCreditTextEl.style.backgroundColor = foregroundColor;
  wallpaperCreditTextEl.style.color = searchTextColor;
};

export const setWallpaperAuthorCredit = (author?: string, link?: string) => {
  if (!wallpaperCreditAnchorEl || !wallpaperCreditTextEl) return;
  initCreditHoverBehavior();

  const cleanAuthor = typeof author === "string" ? author.trim() : "";
  const cleanLink = typeof link === "string" ? link.trim() : "";

  if (!cleanAuthor) {
    if (hideCreditTimeout) {
      globalThis.clearTimeout(hideCreditTimeout);
      hideCreditTimeout = undefined;
    }

    wallpaperCreditTextEl.textContent = "";
    wallpaperCreditTextEl.removeAttribute("href");
    wallpaperCreditAnchorEl.classList.remove("shown");
    wallpaperCreditAnchorEl.classList.add("hidden");
    return;
  }

  wallpaperCreditTextEl.textContent = `photo by ${cleanAuthor}`;
  if (cleanLink) {
    wallpaperCreditTextEl.href = cleanLink;
  } else {
    wallpaperCreditTextEl.removeAttribute("href");
  }
  wallpaperCreditAnchorEl.classList.remove("hidden");
};
