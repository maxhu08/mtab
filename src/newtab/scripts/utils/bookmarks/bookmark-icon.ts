interface BookmarkIconResult {
  iconHTML: string;
  iconSizeClass: string;
}

export const getBookmarkIconDetails = (
  bookmarkIconType: string,
  bookmarkIconColor: string
): BookmarkIconResult => {
  const iconColor = bookmarkIconColor.trim();

  if (bookmarkIconType.startsWith("ri-")) {
    return {
      iconHTML: `<i class="${bookmarkIconType}"></i>`,
      iconSizeClass: "text-4xl md:text-6xl"
    };
  }

  if (bookmarkIconType.startsWith("nf-")) {
    return {
      iconHTML: `<i class="nf ${bookmarkIconType}"></i>`,
      iconSizeClass: "text-5xl md:text-7xl"
    };
  }

  if (/^fa-\w+\sfa-\w+/.test(bookmarkIconType)) {
    const [first, second] = bookmarkIconType.split(/\s/).map((part) => part.slice(3));
    return {
      iconHTML: `<span class="w-10 h-10 md:w-16 md:h-16 inline-block" style="background-color:${iconColor || "transparent"};mask:url('/icons/fontawesome/svgs/${first}/${second}.svg') no-repeat center;-webkit-mask:url('/icons/fontawesome/svgs/${first}/${second}.svg') no-repeat center;transition:background-color 0.3s;pointer-events:none;"></span>`,
      iconSizeClass: ""
    };
  }

  if (bookmarkIconType.startsWith("si-")) {
    const icon = bookmarkIconType.slice(3);
    return {
      iconHTML: `<span class="w-10 h-10 md:w-16 md:h-16 inline-block" style="background-color:${iconColor || "transparent"};mask:url('/icons/simpleicons/${icon}.svg') no-repeat center;-webkit-mask:url('/icons/simpleicons/${icon}.svg') no-repeat center;transition:background-color 0.3s;pointer-events:none;"></span>`,
      iconSizeClass: ""
    };
  }

  if (bookmarkIconType.startsWith("url-")) {
    const src = bookmarkIconType.slice(4);
    // if bookmarkIconColor is empty, use <img> tag directly without applying the mask

    if (iconColor === "") {
      return {
        iconHTML: `<img class="w-10 md:w-14" src="${src}" alt="icon" />`,
        iconSizeClass: ""
      };
    }

    // if bookmarkIconColor is not empty, use mask as before
    const maskStyles = `background-color:${iconColor};mask:url('${src}') no-repeat center/contain;-webkit-mask:url('${src}') no-repeat center/contain;transition:background-color .3s;pointer-events:none`;

    return {
      iconHTML: `<span class="w-10 h-10 md:w-14 md:h-14 inline-block" style="${maskStyles}"></span>`,
      iconSizeClass: ""
    };
  }

  return { iconHTML: "", iconSizeClass: "" };
};
