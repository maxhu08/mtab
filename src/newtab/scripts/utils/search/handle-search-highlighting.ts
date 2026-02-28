import { searchInputEl } from "~/src/newtab/scripts/ui";
import { recognizeUrl } from "~/src/newtab/scripts/utils/search/recognize-url";

let textColor: string | null = null;
let linkTextColor: string | null = null;

export const initSearchHighlighting = (initialTextColor: string, initialLinkTextColor: string) => {
  textColor = initialTextColor;
  linkTextColor = initialLinkTextColor;

  searchInputEl.addEventListener("input", updateSearchHighlighting);
};

export const updateSearchHighlighting = () => {
  if (!textColor || !linkTextColor) return;

  const value = searchInputEl.value;

  if (recognizeUrl(value)) {
    searchInputEl.style.color = linkTextColor;
  } else {
    searchInputEl.style.color = textColor;
  }
};
