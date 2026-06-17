export interface BookmarkIconRenderResult {
  iconEl: HTMLElement;
  iconColor: string;
}

export const createBookmarkIcon = (
  bookmarkIconType: string,
  bookmarkIconColor: string | null | undefined,
  bookmarksDefaultIconColor: string
): BookmarkIconRenderResult | null => {
  const trimmed = bookmarkIconColor?.trim() || undefined;
  const iconColor = trimmed ?? bookmarksDefaultIconColor;

  if (bookmarkIconType.startsWith("ri-")) {
    const iconEl = document.createElement("i");
    iconEl.className = bookmarkIconType;
    iconEl.style.color = iconColor;
    return { iconEl, iconColor };
  }

  if (bookmarkIconType.startsWith("nf-")) {
    const iconEl = document.createElement("i");
    iconEl.className = `nf ${bookmarkIconType}`;
    iconEl.style.color = iconColor;
    return { iconEl, iconColor };
  }

  const assetUrl = getBookmarkIconAssetUrl(bookmarkIconType);
  if (!assetUrl) return null;

  if (bookmarkIconType.startsWith("si-")) {
    return { iconEl: createMaskIcon(assetUrl, iconColor), iconColor };
  }

  if (bookmarkIconType.startsWith("fa-") && trimmed) {
    return { iconEl: createMaskIcon(assetUrl, trimmed), iconColor };
  }

  if (bookmarkIconType.startsWith("url-") && isSvgUrl(assetUrl) && trimmed) {
    return { iconEl: createMaskIcon(assetUrl, trimmed), iconColor };
  }

  return { iconEl: createImageIcon(assetUrl), iconColor };
};

export const getBookmarkIconAssetUrl = (bookmarkIconType: string) => {
  if (bookmarkIconType.startsWith("fa-")) {
    const space = bookmarkIconType.indexOf(" ");
    if (space !== -1 && bookmarkIconType.startsWith("fa-", space + 1)) {
      const first = bookmarkIconType.slice(3, space);
      const second = bookmarkIconType.slice(space + 4);
      return `/icons/fontawesome/svgs/${first}/${second}.svg`;
    }
  }

  if (bookmarkIconType.startsWith("si-")) {
    return `/icons/simpleicons/${bookmarkIconType.slice(3)}.svg`;
  }

  if (bookmarkIconType.startsWith("url-")) {
    return bookmarkIconType.slice(4);
  }

  return null;
};

const createImageIcon = (src: string) => {
  const iconEl = document.createElement("img");
  iconEl.src = src;
  iconEl.alt = "icon";
  iconEl.decoding = "async";
  return iconEl;
};

const createMaskIcon = (maskUrl: string, iconColor: string) => {
  const iconEl = document.createElement("span");
  iconEl.className = "bookmark-mask";
  iconEl.style.setProperty("--icon-color", iconColor || "transparent");
  iconEl.style.setProperty("--icon-mask", `url("${maskUrl.replace(/"/g, '\\"')}")`);
  return iconEl;
};

const isSvgUrl = (src: string) => /\.svg($|\?|#)/i.test(src);