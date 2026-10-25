import { AnimationBookmarkType } from "~/src/utils/config";
import { bookmarkSearchInputEl, contentEl } from "~/src/newtab/scripts/ui";

export const normalizeBookmarkUrl = (url: string) =>
  /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`;

export const openBookmark = (
  bookmarkUrl: string,
  animationsEnabled: boolean,
  animationsType: AnimationBookmarkType,
  openInNewTab: boolean = false
) => {
  const url = normalizeBookmarkUrl(bookmarkUrl);

  if (openInNewTab) {
    chrome.tabs.create({ url, active: false });
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
      window.location.href = url;
    }, animationDuration + 20);
  } else {
    window.location.href = url;
  }
};