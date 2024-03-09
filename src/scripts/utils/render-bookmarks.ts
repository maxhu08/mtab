import { Config } from "src/scripts/config";
import { bookmarksContainerEl } from "src/scripts/ui";

// animations handled separately
export const renderBookmarks = (config: Config) => {
  config.bookmarks.forEach((bookmark, index) => {
    bookmarksContainerEl.innerHTML += `
  <a href="${bookmark.url}" rel="noopener noreferrer">
    <div id="bookmark-${
      bookmark.name
    }-${index}" class="hover:bg-white/20 cursor-pointer bg-neutral-800 rounded-md h-20 md:h-32 overflow-hidden ${
      config.animations ? `${config.animations.animationClass} opacity-0` : ""
    }" ${config.animations ? `style="animation-delay: ${(index + 2) * 50 + 50}ms;"` : ""}>
      <div class="${bookmark.colorClass} h-1"></div>
      <div class="p-1 md:p-2 grid place-items-center h-full">
        <div class="bookmark-icon text-white h-12">
          ${bookmark.iconSvg}
        </div>
      </div>
    </div>
  </a>`;
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
