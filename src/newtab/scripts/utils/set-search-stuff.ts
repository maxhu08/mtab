import { FontType } from "src/newtab/scripts/config";
import { bookmarkSearchInputEl, searchInputEl } from "src/newtab/scripts/ui";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const setSearchStuff = (
  placeholderText: string,
  bookmarkPlaceholderText: string,
  fontType: FontType,
  fontCustom: string
) => {
  // const searchFontCss = `
  // .font-search {
  //   font-family: ${font};
  // }
  // .font-bookmark-search {
  //   font-family: ${font};
  // }
  // .font-bookmark-search-results {
  //   font-family: ${font};
  // }`;

  if (fontType === "default") {
    const font = '"Jetbrains-Mono-Regular-Fixed"';
    insertCSS(
      `.font-search{font-family:${font};}.font-bookmark-search{font-family:${font};}.font-bookmark-search-results{font-family:${font};}`
    );
  } else {
    console.log("CUSTOM FONT");
  }

  searchInputEl.placeholder = placeholderText;
  bookmarkSearchInputEl.placeholder = bookmarkPlaceholderText;
};
