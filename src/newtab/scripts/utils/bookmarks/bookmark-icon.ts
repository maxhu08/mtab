interface BookmarkIconResult {
  iconHTML: string;
  iconSizeClass: string;
}

export const getBookmarkIconDetails = (
  bookmarkIconType: string,
  bookmarkIconColor: string
): BookmarkIconResult => {
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
      iconHTML: `<span class="w-10 h-10 md:w-16 md:h-16" style="display:inline-block;background-color:${bookmarkIconColor};mask:url('/icons/fontawesome/svgs/${first}/${second}.svg') no-repeat center;-webkit-mask:url('/icons/fontawesome/svgs/${first}/${second}.svg') no-repeat center;transition:background-color 0.3s;pointer-events:none;"></span>`,
      iconSizeClass: ""
    };
  }

  if (bookmarkIconType.startsWith("si-")) {
    const icon = bookmarkIconType.slice(3);
    return {
      iconHTML: `<span class="w-10 h-10 md:w-16 md:h-16" style="display:inline-block;background-color:${bookmarkIconColor};mask:url('/icons/simpleicons/${icon}.svg') no-repeat center;-webkit-mask:url('/icons/simpleicons/${icon}.svg') no-repeat center;transition:background-color 0.3s;pointer-events:none;"></span>`,
      iconSizeClass: ""
    };
  }

  if (bookmarkIconType.startsWith("url-")) {
    const src = bookmarkIconType.slice(4);
    return {
      iconHTML: `<span class="w-10 h-10 md:w-16 md:h-16" style="display:inline-block;background-color:${bookmarkIconColor};mask:url('${src}') no-repeat center/contain;-webkit-mask:url('${src}') no-repeat center/contain;transition:background-color .3s;pointer-events:none"></span>`,
      iconSizeClass: ""
    };
  }

  return { iconHTML: "", iconSizeClass: "" };
};
