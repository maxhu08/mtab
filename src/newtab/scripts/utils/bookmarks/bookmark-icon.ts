interface BookmarkIconResult {
  iconHTML: string;
  iconSizeClass: string;
}

export const getBookmarkIconDetails = (
  bookmarkIconType: string,
  bookmarkIconColor: string
): BookmarkIconResult => {
  let iconHTML = "";
  let iconSizeClass = "";

  if (bookmarkIconType.startsWith("ri-")) {
    iconHTML = `<i class="${bookmarkIconType}"></i>`;
    iconSizeClass = "text-4xl md:text-6xl";
  } else if (bookmarkIconType.startsWith("nf-")) {
    iconHTML = `<i class="nf ${bookmarkIconType}"></i>`;
    iconSizeClass = "text-5xl md:text-7xl";
  } else if (/^fa-\w+\sfa-\w+/.test(bookmarkIconType)) {
    const match = bookmarkIconType.match(/^fa-(\w+)\sfa-(\w+)/);
    if (match) {
      const [, first, second] = match;
      iconHTML = `<span class="w-10 h-10 md:w-16 md:h-16" style="display:inline-block;background-color:${bookmarkIconColor};mask:url('/icons/fontawesome/svgs/${first}/${second}.svg') no-repeat center;-webkit-mask:url('/icons/fontawesome/svgs/${first}/${second}.svg') no-repeat center;transition:background-color 0.3s;pointer-events:none;"></span>`;
    }
  } else if (bookmarkIconType.startsWith("url-")) {
    const src = bookmarkIconType.split("url-")[1];
    iconHTML = `<img class="w-10 md:w-14" src="${src}" />`;
  }

  return { iconHTML, iconSizeClass };
};
