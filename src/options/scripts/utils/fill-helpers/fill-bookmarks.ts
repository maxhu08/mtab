import { Bookmark, Config } from "src/newtab/scripts/config";
import { focusInput, unfocusInput } from "src/options/scripts/inputs";
import { Input, bookmarksOptionsContainerEl } from "src/options/scripts/ui";

export const fillBookmarksInputs = (config: Config) => {
  config.bookmarks.forEach((bookmark, index) => {
    bookmarksOptionsContainerEl.innerHTML += `
    <div class="bg-neutral-800 p-2 rounded-md grid grid-flow-row gap-4">
      <span class="text-white text-base">bookmark ${index}</span>
      <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
      <div class="grid gap-2">
        <p class="text-white text-base">bookmark.name</p>
        <div
          id="bookmark-${index}-name-container"
          class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
          <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
          <input id="bookmark-${index}-name-input" type="text" autocomplete="off"
            class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input name..." value="${bookmark.name}">
        </div>
      </div>
      <div class="grid gap-2">
        <p class="text-white text-base">bookmark.url</p>
        <div
          id="bookmark-${index}-url-container"
          class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
          <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
          <input id="bookmark-${index}-url-input" type="text" autocomplete="off"
            class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input url..." value="${bookmark.url}">
        </div>
      </div>
      <div class="grid gap-2">
        <p class="text-white text-base">bookmark.iconType</p>
        <div
          id="bookmark-${index}-icon-type-container"
          class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
          <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
          <input id="bookmark-${index}-icon-type-input" type="text" autocomplete="off"
            class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input icon type..." value="${bookmark.iconType}">
        </div>
      </div>
      <div class="grid gap-2">
        <p class="text-white text-base">bookmark.color</p>
        <div
          id="bookmark-${index}-color-container"
          class="grid grid-cols-[max-content_auto] text-base bg-neutral-900 w-full p-1 rounded-md border-2 border-transparent">
          <span class="text-sky-500 font-semibold select-none">>&nbsp;</span>
          <input id="bookmark-${index}-color-input" type="text" autocomplete="off"
            class="outline-none bg-transparent text-white placeholder-neutral-500" placeholder="input color..." value="${bookmark.color}">
        </div>
      </div>
    </div>
    `;
  });

  config.bookmarks.forEach((bookmark, index) => {
    handleBookmarkSettings(bookmark, index);
  });
};

// prettier-ignore
const handleBookmarkSettings = (bookmark: Bookmark, index: number) => {
  const bookmarkInputBorderClass = "border-sky-500";

  const inputs: Input[] = [
    {
      container: document.getElementById(`bookmark-${index}-name-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-name-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${index}-url-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-url-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${index}-icon-type-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-icon-type-input`) as HTMLInputElement
    },
    {
      container: document.getElementById(`bookmark-${index}-color-container`) as HTMLDivElement,
      input: document.getElementById(`bookmark-${index}-color-input`) as HTMLInputElement
    }
  ]

  inputs.forEach((input) => {
    input.input.addEventListener("blur", () =>
      unfocusInput({
        container: input.container,
        input: input.input,
        borderClassOld: bookmarkInputBorderClass,
        borderClassNew: "border-transparent"
      })
    );

    input.input.addEventListener("focus", (e) =>
      focusInput({
        container: input.container,
        input: input.input,
        borderClassOld: "border-transparent",
        borderClassNew: bookmarkInputBorderClass,
        e
      })
    );
  });
};
