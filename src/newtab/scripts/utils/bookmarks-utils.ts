import { AnimationBookmarkType, Config } from "src/newtab/scripts/config";
import { bookmarkSearchInputEl, contentEl } from "src/newtab/scripts/ui";

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
      contentEl.style.opacity = "0%";
    }, animationDuration - 10);

    setTimeout(() => {
      window.location.href = bookmarkUrl;
    }, animationDuration + 20);
  } else {
    window.location.href = bookmarkUrl;
  }
};
