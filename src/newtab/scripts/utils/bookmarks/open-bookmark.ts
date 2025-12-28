import { AnimationBookmarkType } from "src/utils/config";
import { bookmarkSearchInputEl, contentEl } from "src/newtab/scripts/ui";

export const openBookmark = (
  bookmarkUrl: string,
  animationsEnabled: boolean,
  animationsType: AnimationBookmarkType,
  openInNewTab: boolean = false
) => {
  if (!/^https?:\/\//i.test(bookmarkUrl) && !/^about:/i.test(bookmarkUrl)) {
    bookmarkUrl = `https://${bookmarkUrl}`;
  }

  if (openInNewTab) {
    chrome.tabs.create({ url: bookmarkUrl, active: false });
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
