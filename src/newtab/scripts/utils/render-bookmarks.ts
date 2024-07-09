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
      renderDefaultBookmarks(config);
      break;
    }
  }
};

const renderDefaultBookmarks = (config: Config) => {
  switch (config.ui.style) {
    case "glass": {
      bookmarksContainerEl.classList.add("glass-effect");
      break;
    }
    case "solid": {
      bookmarksContainerEl.classList.add("bg-foreground");
      break;
    }
  }

  bookmarksContainerEl.innerHTML += `<div id="inner-bookmark-container"></div>`;
  // prettier-ignore
  const innerBookmarkContainer = document.getElementById("inner-bookmark-container") as HTMLDivElement;

  bookmarksContainerEl.classList.add(
    "p-2",
    "rounded-md",
    "overflow-hidden",
    "w-full",
    "overflow-scroll",
    "scrollbar-hidden",
    config.animations.enabled ? config.animations.type : "_ignore",
    config.animations.enabled ? "opacity-0" : "_ignore"
  );

  innerBookmarkContainer.classList.add("grid", "grid-flow-col", "gap-2", "w-max");

  chrome.bookmarks.search({}, (chromeBookmarks) => {
    if (chromeBookmarks.length === 0) {
      innerBookmarkContainer.innerHTML += `
        <div class="overflow-hidden h-16 md:h-20 grid grid-rows-[auto_max-content] place-items-center">
          <span class="text-white text-base md:text-2xl font-message w-full text-center text-ellipsis overflow-hidden whitespace-nowrap">
            No bookmarks yet
          </span>
        </div>
      </a>
      `;
    }

    chromeBookmarks.forEach((bookmark) => {
      innerBookmarkContainer.innerHTML += `
      <a href="${bookmark.url}" rel="noopener noreferrer">
        <div class="overflow-hidden w-16 md:w-20 aspect-square grid grid-rows-[auto_max-content] place-items-center">
          <img class="h-[80%]" src="${`chrome-extension://${
            chrome.runtime.id
          }/_favicon/?pageUrl=${encodeURIComponent(bookmark.url as string)}&size=${32}`}" />
          <span class="text-white text-base w-full text-center text-ellipsis overflow-hidden whitespace-nowrap">
            ${bookmark.title.toString()}
          </span>
        </div>
      </a>
      `;
    });
  });

  config.animations &&
    bookmarksContainerEl.addEventListener(
      "animationend",
      () => {
        bookmarksContainerEl.classList.remove("opacity-0");
      },
      {
        once: true
      }
    );
};

// animations handled separately
const renderUserDefinedBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "grid-flow-row", "gap-2");

  config.bookmarks.userDefined.forEach((bookmark, index) => {
    if (index === 0) {
      bookmarksContainerEl.innerHTML += `<div id="bookmarks-subcontainer-${index}" class="grid grid-cols-2 md:grid-cols-4 w-full gap-2"></div>`;
    } else if (index % 4 === 0) {
      bookmarksContainerEl.innerHTML += `<div id="bookmarks-subcontainer-${
        index / 4
      }" class="grid grid-cols-2 md:grid-cols-4 w-full gap-2"></div>`;
    }

    let delay = 0;

    if (config.animations.bookmarkTiming === "uniform") delay = 150;
    else if (config.animations.bookmarkTiming === "left") delay = (index + 2) * 50;
    else if (config.animations.bookmarkTiming === "right")
      delay = (config.bookmarks.userDefined.length + 2 - index) * 50;

    const bookmarksSubcontainerEl = document.getElementById(
      `bookmarks-subcontainer-${Math.floor(index / 4)}`
    ) as HTMLDivElement;

    bookmarksSubcontainerEl.innerHTML += `
    <div id="bookmark-${
      bookmark.name
    }-${index}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${
      config.ui.style === "glass" ? "glass-effect" : ""
    } rounded-md h-bookmark overflow-hidden ${
      config.animations.enabled ? `${config.animations.type} opacity-0` : ""
    }" ${config.animations ? `style="animation-delay: ${delay}ms;"` : ""}>
      <div class="h-1" style="background-color: ${bookmark.color}"></div>
      <div class="absolute w-full h-full hover:bg-white/20"></div>
      <div class="p-1 md:p-2 grid place-items-center h-full">
        <div class="bookmark-icon text-white text-4xl md:text-6xl">
          <i class="${bookmark.iconType}"></i>
        </div>
      </div>
    </div>
    `;
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

      bookmarkEl!.onclick = () => {
        if (config.animations.enabled) {
          const content = document.getElementById("content") as HTMLDivElement;

          const animationDuration = 350;

          content.classList.add("animate-page-up");
          setTimeout(() => {
            content.classList.remove("animate-page-up");
            content.style.opacity = "0%";
          }, animationDuration * 0.75);

          setTimeout(() => {
            window.location.href = bookmark.url;
          }, animationDuration);
        } else {
          window.location.href = bookmark.url;
        }
      };
    });
};
