import {
  AnimationBookmarkType,
  AnimationInitialType,
  BookmarkTiming,
  UIStyle
} from "src/newtab/scripts/config";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/bookmark-utils";
import { focusElementBorder, unfocusElementBorder } from "src/newtab/scripts/utils/focus-utils";
import { genid } from "src/utils/genid";

export const renderBlockBookmark = (
  containerEl: HTMLDivElement,
  bookmarkTiming: BookmarkTiming,
  bookmarksLength: number,
  bookmarkIndex: number,
  bookmarkName: string,
  bookmarkColor: string,
  bookmarkIconColor: string | null,
  bookmarkIconType: string | null,
  bookmarkIconHTML: string,
  uiStyle: UIStyle,
  showName: boolean,
  nameTextColor: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType
) => {
  let delay = 0;

  if (bookmarkTiming === "uniform") delay = 150;
  else if (bookmarkTiming === "left") delay = (bookmarkIndex + 2) * 50;
  else if (bookmarkTiming === "right") delay = (bookmarksLength + 2 - bookmarkIndex) * 50;

  let iconHTML = bookmarkIconHTML;
  let iconSizeClass = "";

  if (bookmarkIconType) {
    if (bookmarkIconType.startsWith("ri-")) {
      iconHTML = `<i class="${bookmarkIconType}"></i>`;
      iconSizeClass = "text-4xl md:text-6xl";
    } else if (bookmarkIconType.startsWith("nf-")) {
      iconHTML = `<i class="nf ${bookmarkIconType}"></i>`;
      iconSizeClass = "text-5xl md:text-7xl";
    } else if (bookmarkIconType.startsWith("url-")) {
      const src = bookmarkIconType.split("url-")[1];
      iconHTML = `<img class="w-10 md:w-14" src="${src}" />`;
    }
  }

  const uuid = genid();

  // <button id="bookmark-${uuid}" class="relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}" ${animationsEnabled ? `style="animation-delay: ${delay}ms;"` : ""}>
  //   <div id="bookmark-${uuid}-border" class="absolute w-full h-full border-2 border-transparent corner-style"></div>
  //   <div class="h-1" style="background-color: ${bookmarkColor}"></div>
  //   <div class="absolute w-full h-full hover:bg-white/20"></div>
  //   <div class="p-1 md:p-2 grid place-items-center h-full">
  //     <div class="bookmark-icon${iconSizeClass && " " + iconSizeClass}"${bookmarkIconColor ? ` style="color: ${bookmarkIconColor};"` : ""}>
  //       ${iconHTML}
  //     </div>
  //     ${showName ? `<span class="visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap" style="color: ${nameTextColor}">${bookmarkVanityName}</span>` : ""}
  //   </div>
  // </button>

  const button = document.createElement("button");
  button.id = `bookmark-${uuid}`;
  button.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 outline-none` : ""}`;
  if (animationsEnabled) button.style.animationDelay = `${delay}ms`;

  const borderDiv = document.createElement("div");
  borderDiv.id = `bookmark-${uuid}-border`;
  borderDiv.className = "absolute w-full h-full border-2 border-transparent corner-style";

  const colorBar = document.createElement("div");
  colorBar.className = "h-1";
  colorBar.style.backgroundColor = bookmarkColor;

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute w-full h-full hover:bg-white/20";

  const gridDiv = document.createElement("div");
  gridDiv.className = "p-1 md:p-2 grid place-items-center h-full";

  const iconDiv = document.createElement("div");
  iconDiv.className = `bookmark-icon${iconSizeClass ? " " + iconSizeClass : ""}`;
  if (bookmarkIconColor) {
    iconDiv.style.color = bookmarkIconColor;
  }
  iconDiv.innerHTML = iconHTML;

  let nameSpan: HTMLSpanElement | null = null;
  if (showName) {
    nameSpan = document.createElement("span");
    nameSpan.className =
      "visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap";
    nameSpan.style.color = nameTextColor;
    nameSpan.textContent = bookmarkName;
  }

  button.appendChild(borderDiv);
  button.appendChild(colorBar);
  button.appendChild(hoverDiv);
  gridDiv.appendChild(iconDiv);
  if (nameSpan) gridDiv.appendChild(nameSpan);
  button.appendChild(gridDiv);

  containerEl.appendChild(button);

  return uuid;
};

export const bindActionsToBlockNode = (
  uuid: string,
  url: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  animationsBookmarkType: AnimationBookmarkType,
  focusedBorderColor: string
) => {
  // prettier-ignore
  const bookmarkEl = document.getElementById(`bookmark-${uuid}`) as HTMLButtonElement;
  // prettier-ignore
  const bookmarkBorderEl = document.getElementById(`bookmark-${uuid}-border`) as HTMLDivElement;

  if (bookmarkEl && animationsEnabled) {
    const computedStyle = window.getComputedStyle(bookmarkEl);
    const animationDuration = parseFloat(computedStyle.animationDuration) * 1000;
    bookmarkEl.addEventListener(
      "animationstart",
      () => {
        // fix weird flickering issue on firefox
        setTimeout(() => {
          bookmarkEl.classList.remove("opacity-0");
          // fix bookmarks animations replaying after bookmark search esc
          bookmarkEl.classList.remove(animationsInitialType);
        }, animationDuration * 0.8); // needs to be less than 1
      },
      {
        once: true
      }
    );

    // fix bookmarks disappearing if user leaves tab too quickly
    document.addEventListener("visibilitychange", () => {
      bookmarkEl.classList.remove("opacity-0");
    });
  }

  const isFolder = false;

  if (isFolder) {
    bookmarkEl.onmouseup = () =>
      // openBookmarkFolder(chromeBookmarks, node.parentId!, node.id, config, true);
      console.log("open folder");
  } else {
    // can't be onclick in order to register middle click and can't be onmousedown because open in new tab fails
    bookmarkEl.onmouseup = (e) => {
      // open in new tab when holding ctrl or middle click
      if (e.ctrlKey || e.button === 1) {
        openBookmark(url, animationsEnabled, animationsBookmarkType, true);
      } else if (e.button === 0) {
        openBookmark(url, animationsEnabled, animationsBookmarkType);
      }
    };
  }

  bookmarkEl.addEventListener("blur", () => unfocusElementBorder(bookmarkBorderEl));
  bookmarkEl.addEventListener("focus", (e) =>
    focusElementBorder(bookmarkBorderEl, focusedBorderColor, e)
  );
};
