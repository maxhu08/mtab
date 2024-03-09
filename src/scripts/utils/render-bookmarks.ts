import { Config } from "src/scripts/config";
import { bookmarksContainerEl } from "src/scripts/ui";

// animations handled separately
export const renderBookmarks = (config: Config) => {
  config.bookmarks.forEach((bookmark, index) => {
    bookmarksContainerEl.innerHTML += `<div id="bookmark-${
      bookmark.name
    }-${index}" class="bg-neutral-800 rounded-md p-1 md:p-2 h-20 md:h-32 overflow-hidden ${
      config.animations && `${config.animations.animationClass} opacity-0`
    }" ${config.animations && `style="animation-delay: ${(index + 2) * 50 + 50 + "ms"};"`}>
      <span>${bookmark.name}</span>
      <span>${bookmark.url}</span>
      <span>${bookmark.activationKey}</span>
    </div>`;
  });

  config.animations &&
    config.bookmarks.forEach((bookmark, index) => {
      const bookmarkEl = document.getElementById(`bookmark-${bookmark.name}-${index}`);
      if (bookmarkEl && config.animations) {
        bookmarkEl.addEventListener("animationend", () => {
          bookmarkEl.classList.remove("opacity-0");
        });
      }
    });
};
