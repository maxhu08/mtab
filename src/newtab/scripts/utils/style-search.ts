import { UIStyle } from "src/newtab/scripts/config";
import { searchContainerEl, searchInputEl } from "src/newtab/scripts/ui";

export const styleSearch = (
  style: UIStyle,
  textColor: string,
  placeholderTextColor: string,
  foregroundColor: string
) => {
  searchInputEl.style.color = textColor;

  const placeholderTextColorCss = `
.placeholder-color-search::placeholder {
  color: ${placeholderTextColor};
}`;

  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(placeholderTextColorCss));
  document.head.appendChild(styleElement);

  if (style === "solid") {
    searchContainerEl.classList.add("bg-neutral-900");

    searchContainerEl.style.backgroundColor = foregroundColor;

    return;
  }
  if (style === "glass") {
    searchContainerEl.classList.add("glass-effect");
    searchInputEl.classList.replace("placeholder-neutral-500", "placeholder-neutral-400");
    return;
  }
};
