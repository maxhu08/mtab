interface BookmarkIconResult {
  iconHTML: string;
  iconSizeClass: string;
  iconColor: string;
}

export const getBookmarkIconDetails = (
  bookmarkIconType: string,
  bookmarkIconColor: string | null | undefined,
  bookmarksDefaultIconColor: string
): BookmarkIconResult => {
  const trimmed = bookmarkIconColor == null ? undefined : bookmarkIconColor.trim() || undefined;

  const iconColor = trimmed ?? bookmarksDefaultIconColor;

  if (bookmarkIconType.startsWith("ri-")) {
    return {
      iconHTML: `<i class="${bookmarkIconType}"></i>`,
      iconSizeClass: "text-4xl md:text-6xl",
      iconColor
    };
  }

  if (bookmarkIconType.startsWith("nf-")) {
    return {
      iconHTML: `<i class="nf ${bookmarkIconType}"></i>`,
      iconSizeClass: "text-5xl md:text-7xl",
      iconColor
    };
  }

  if (bookmarkIconType.startsWith("fa-")) {
    const space = bookmarkIconType.indexOf(" ");
    if (space !== -1 && bookmarkIconType.startsWith("fa-", space + 1)) {
      const first = bookmarkIconType.slice(3, space);
      const second = bookmarkIconType.slice(space + 4);
      const url = `/icons/fontawesome/svgs/${first}/${second}.svg`;

      return {
        iconHTML:
          trimmed !== undefined
            ? maskSpanHTML(url, trimmed)
            : `<img class="w-10 md:w-14" src="${url}" alt="icon" />`,
        iconSizeClass: "",
        iconColor
      };
    }
  }

  if (bookmarkIconType.startsWith("si-")) {
    const icon = bookmarkIconType.slice(3);
    const url = `/icons/simpleicons/${icon}.svg`;

    return {
      iconHTML: maskSpanHTML(url, iconColor),
      iconSizeClass: "",
      iconColor
    };
  }

  if (bookmarkIconType.startsWith("url-")) {
    const src = bookmarkIconType.slice(4);

    if (!isSvgUrl(src) || trimmed === undefined) {
      return {
        iconHTML: `<img class="w-10 md:w-14" src="${src}" alt="icon" />`,
        iconSizeClass: "",
        iconColor
      };
    }

    return {
      iconHTML: maskSpanHTML(src, trimmed),
      iconSizeClass: "",
      iconColor
    };
  }

  return { iconHTML: "", iconSizeClass: "", iconColor: "" };
};

const isSvgUrl = (src: string) => /\.svg($|\?|#)/i.test(src);

const maskSpanHTML = (maskUrl: string, iconColor: string) => {
  const color = iconColor || "transparent";
  return `<span class="bookmark-mask" style="--icon-color:${color};--icon-mask:url('${maskUrl}')"></span>`;
};
