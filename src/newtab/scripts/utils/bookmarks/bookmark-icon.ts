import { createBookmarkIcon, getBookmarkIconAssetUrl } from "~/src/utils/bookmark-icon";

type NewtabBookmarkIconResult = {
  iconEl: HTMLElement | null;
  iconSizeClass: string;
  iconColor: string;
};

const preloadedBookmarkIconUrls = new Set<string>();

export const createNewtabBookmarkIcon = (
  bookmarkIconType: string,
  bookmarkIconColor: string | null | undefined,
  bookmarksDefaultIconColor: string
): NewtabBookmarkIconResult => {
  const icon = createBookmarkIcon(bookmarkIconType, bookmarkIconColor, bookmarksDefaultIconColor);
  if (!icon) return { iconEl: null, iconSizeClass: "", iconColor: "" };

  const iconSizeClass = bookmarkIconType.startsWith("ri-")
    ? "text-4xl md:text-6xl"
    : bookmarkIconType.startsWith("nf-")
      ? "text-5xl md:text-7xl"
      : "";

  if (icon.iconEl instanceof HTMLImageElement) {
    icon.iconEl.className = "w-10 md:w-14";
  }

  return { iconEl: icon.iconEl, iconSizeClass, iconColor: icon.iconColor };
};

export const preloadBookmarkIconAsset = (bookmarkIconType: string) => {
  const assetUrl = getBookmarkIconAssetUrl(bookmarkIconType);
  if (!assetUrl || preloadedBookmarkIconUrls.has(assetUrl)) return;

  preloadedBookmarkIconUrls.add(assetUrl);

  const img = new Image();
  img.decoding = "async";
  img.src = assetUrl;
};