import { Config } from "src/newtab/scripts/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  focusBookmark,
  openBookmark,
  unfocusBookmark
} from "src/newtab/scripts/utils/bookmarks-utils";

// animations handled separately
export const renderUserDefinedBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "gap-2", "user-defined-bookmarks-cols");

  const userDefinedBookmarkCss = `
.user-defined-bookmarks-cols {
  grid-template-columns: 1fr 1fr;
}

@media (min-width: 768px) {
  .user-defined-bookmarks-cols {
    grid-template-columns: repeat(${config.bookmarks.userDefinedCols}, minmax(0, 1fr));
  }
}
`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(userDefinedBookmarkCss));
  document.head.appendChild(styleElement);

  config.bookmarks.userDefined.forEach((bookmark, index) => {
    let delay = 0;

    if (config.animations.bookmarkTiming === "uniform") delay = 150;
    else if (config.animations.bookmarkTiming === "left") delay = (index + 2) * 50;
    else if (config.animations.bookmarkTiming === "right")
      delay = (config.bookmarks.userDefined.length + 2 - index) * 50;

    let iconHTML = "";
    let iconSizeClass = "";

    if (bookmark.iconType.startsWith("ri-")) {
      iconHTML = `<i class="${bookmark.iconType}"></i>`;
      iconSizeClass = "text-4xl md:text-6xl";
    } else if (bookmark.iconType.startsWith("nf-")) {
      iconHTML = `<i class="nf ${bookmark.iconType}"></i>`;
      iconSizeClass = "text-5xl md:text-7xl";
    } else if (bookmark.iconType.startsWith("url-")) {
      const src = bookmark.iconType.split("url-")[1];
      iconHTML = `<img class="w-10 md:w-14" src="${src}" />`;
    }

    bookmarksContainerEl.innerHTML += `
    <button id="bookmark-${
      bookmark.name
    }-${index}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${
      config.ui.style === "glass" ? "glass-effect" : ""
    } rounded-md h-bookmark overflow-hidden ${
      config.animations.enabled ? `${config.animations.initialType} opacity-0 outline-none` : ""
    }" ${config.animations ? `style="animation-delay: ${delay}ms;"` : ""}>
      <div id="bookmark-${
        bookmark.name
      }-${index}-border" class="absolute w-full h-full border-2 border-transparent rounded-md"></div>
      <div class="h-1" style="background-color: ${bookmark.color}"></div>
      <div class="absolute w-full h-full hover:bg-white/20"></div>
      <div class="p-1 md:p-2 grid place-items-center h-full">
        <div class="bookmark-icon ${iconSizeClass}" style="color: ${bookmark.iconColor};">
          ${iconHTML}
        </div>
      </div>
    </button>
    `;
  });

  config.bookmarks.userDefined.forEach((bookmark, index) => {
    // prettier-ignore
    const bookmarkEl = document.getElementById(`bookmark-${bookmark.name}-${index}`) as HTMLDivElement;
    // prettier-ignore
    const bookmarkBorderEl = document.getElementById(`bookmark-${bookmark.name}-${index}-border`) as HTMLDivElement;

    bookmarkEl.addEventListener("blur", () => unfocusBookmark(bookmarkBorderEl));
    bookmarkEl.addEventListener("focus", (e) => focusBookmark(bookmarkBorderEl, config, e));
  });

  config.animations &&
    config.bookmarks.userDefined.forEach((bookmark, index) => {
      // prettier-ignore
      const bookmarkEl = document.getElementById(`bookmark-${bookmark.name}-${index}`) as HTMLButtonElement;

      if (bookmarkEl && config.animations) {
        const computedStyle = window.getComputedStyle(bookmarkEl);
        const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
        bookmarkEl.addEventListener(
          "animationstart",
          () => {
            // Fix weird flickering issue on firefox
            setTimeout(() => {
              bookmarkEl.classList.remove("opacity-0");
              // fix bookmarks animations replaying after bookmark search esc
              bookmarkEl.classList.remove(config.animations.initialType);
            }, animationDuration * 0.75); // needs to be less than 1
          },
          {
            once: true
          }
        );

        // Fix bookmarks disappearing if user leaves tab too quickly
        document.addEventListener("visibilitychange", () => {
          bookmarkEl.classList.remove("opacity-0");
        });
      }

      bookmarkEl.onclick = (e) => {
        if (e.ctrlKey) {
          openBookmark(
            bookmark.url,
            config.animations.enabled,
            config.animations.bookmarkType,
            true
          );
        } else {
          openBookmark(bookmark.url, config.animations.enabled, config.animations.bookmarkType);
        }
      };
    });
};
