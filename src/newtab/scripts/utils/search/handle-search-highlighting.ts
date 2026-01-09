import { searchInputEl } from "src/newtab/scripts/ui";
import { recognizeUrl } from "src/newtab/scripts/utils/search/recognize-url";

export const handleSearchHighlighting = (textColor: string, linkTextColor: string) => {
  searchInputEl.addEventListener("input", () => {
    updateSearchHighlighting(textColor, linkTextColor);
  });
};

export const updateSearchHighlighting = (textColor: string, linkTextColor: string) => {
  const value = searchInputEl.value;

  if (recognizeUrl(value)) {
    searchInputEl.style.color = linkTextColor;
  } else {
    searchInputEl.style.color = textColor;
  }
};
