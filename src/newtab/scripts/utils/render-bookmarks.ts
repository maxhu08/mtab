import { AnimationBookmarkType, Config } from "../config";
import { bookmarksContainerEl, bookmarkSearchInputEl, contentEl } from "../ui";

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
    config.animations.enabled ? config.animations.initialType : "_ignore",
    config.animations.enabled ? "opacity-0" : "_ignore"
  );

  chrome.bookmarks.search({}, (chromeBookmarks) => {
    if (chromeBookmarks.length === 0) {
      innerBookmarkContainer.innerHTML += `
        <div class="overflow-hidden h-16 md:h-20 grid grid-rows-[auto_max-content] place-items-center">
          <span class="text-search text-base md:text-2xl font-message w-full text-center text-ellipsis overflow-hidden whitespace-nowrap"
                style="color: ${config.search.textColor}"
          >
            No bookmarks yet
          </span>
        </div>
      </a>
      `;
    }

    if (chromeBookmarks.length > 0) {
      innerBookmarkContainer.classList.add("grid", "grid-flow-col", "gap-2", "w-max");
    }

    chromeBookmarks.forEach((bookmark) => {
      if (!!bookmark.dateGroupModified) return;

      innerBookmarkContainer.innerHTML += `
      <button id="bookmark-default-${
        bookmark.id
      }" class="overflow-hidden w-16 md:w-20 aspect-square grid grid-rows-[auto_max-content] place-items-center cursor-pointer">
        <img class="h-[80%]" src="${`chrome-extension://${
          chrome.runtime.id
        }/_favicon/?pageUrl=${encodeURIComponent(bookmark.url as string)}&size=${32}`}" />
        <span class="text-base w-full font-search text-center text-ellipsis overflow-hidden whitespace-nowrap"
              style="color: ${config.search.textColor}"
        >
          ${bookmark.title.toString()}
        </span>
      </button>
      `;
    });

    chromeBookmarks.forEach((bookmark) => {
      if (!!bookmark.dateGroupModified) return;

      // prettier-ignore
      const bookmarkEl = document.getElementById(`bookmark-default-${bookmark.id}`) as HTMLDivElement;
      console.log(bookmarkEl, bookmark);
      bookmarkEl.onclick = (e) => {
        if (e.ctrlKey) {
          openBookmark(
            bookmark.url!,
            config.animations.enabled,
            config.animations.bookmarkType,
            true
          );
        } else {
          openBookmark(bookmark.url!, config.animations.enabled, config.animations.bookmarkType);
        }
      };
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

  bookmarksContainerEl.style.gridTemplateColumns = ``;

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
      iconSizeClass = "text-3xl md:text-5xl";
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
            }, animationDuration - 500);
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

export const focusBookmark = (bookmarkBorderEl: HTMLDivElement, config: Config, e: Event) => {
  bookmarkBorderEl.classList.remove("border-transparent");
  bookmarkBorderEl.style.borderColor = config.search.focusedBorderColor;

  bookmarkBorderEl.focus();
  e.preventDefault();
};

export const unfocusBookmark = (bookmarkBorderEl: HTMLDivElement) => {
  bookmarkBorderEl.blur();

  bookmarkBorderEl.style.borderColor = "#00000000";
  bookmarkBorderEl.classList.add("border-transparent");
};

export const openBookmark = (
  bookmarkUrl: string,
  animationsEnabled: boolean,
  animationsType: AnimationBookmarkType,
  openInNewTab: boolean = false
) => {
  if (openInNewTab) {
    window.open(bookmarkUrl, "_blank");
    bookmarkSearchInputEl.value = "";

    return;
  }

  if (animationsEnabled) {
    contentEl.classList.add(animationsType);
    const computedStyle = getComputedStyle(contentEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;

    setTimeout(() => {
      contentEl.classList.remove(animationsType);
      contentEl.style.opacity = "0%";
    }, animationDuration * 0.75);

    setTimeout(() => {
      window.location.href = bookmarkUrl;
    }, animationDuration + 20);
  } else {
    window.location.href = bookmarkUrl;
  }
};
