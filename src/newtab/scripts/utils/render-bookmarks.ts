import { icons } from "src/newtab/scripts/icons";
import { Config } from "../config";
import { bookmarksContainerEl } from "../ui";

export const renderBookmarks = (config: Config) => {
  switch (config.bookmarks.type) {
    case "none": {
      return;
    }
    case "user-defined": {
      renderUserDefinedBookmarks(config);
      break;
    }
    case "default": {
      alert("using default bookmarks");
      break;
    }
  }
};

// animations handled separately
const renderUserDefinedBookmarks = (config: Config) => {
  config.bookmarks.userDefined.forEach((bookmark, index) => {
    let delay = 0;

    if (config.animations.bookmarkTiming === "uniform") delay = 150;
    else if (config.animations.bookmarkTiming === "left") delay = (index + 2) * 50;
    else if (config.animations.bookmarkTiming === "right")
      delay = (config.bookmarks.userDefined.length + 2 - index) * 50;

    bookmarksContainerEl.innerHTML += `
  <a href="${bookmark.url}" rel="noopener noreferrer">
    <div id="bookmark-${
      bookmark.name
    }-${index}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${
      config.ui.style === "glass" ? "glass-effect" : ""
    } rounded-md h-20 md:h-32 overflow-hidden ${
      config.animations.enabled ? `${config.animations.type} opacity-0` : ""
    }" ${config.animations ? `style="animation-delay: ${delay}ms;"` : ""}>
      <div class="h-1" style="background-color: ${bookmark.color}"></div>
      <div class="absolute w-full h-full hover:bg-white/20"></div>
      <div class="p-1 md:p-2 grid place-items-center h-full">
        <div class="bookmark-icon text-white h-12">
          ${icons[bookmark.iconType]}
        </div>
      </div>
    </div>
  </a>`;
  });

  config.animations &&
    config.bookmarks.userDefined.forEach((bookmark, index) => {
      const bookmarkEl = document.getElementById(`bookmark-${bookmark.name}-${index}`);
      if (bookmarkEl && config.animations) {
        bookmarkEl.addEventListener(
          "animationend",
          () => {
            bookmarkEl.classList.remove("opacity-0");
          },
          {
            once: true
          }
        );
      }
    });
};
