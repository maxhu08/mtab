import { bookmarkSearchSectionEl, searchSectionEl } from "src/newtab/scripts/ui";

export const searchBookmark = (toggle: "on" | "off") => {
  if (toggle === "on") {
    searchSectionEl.classList.replace("grid", "hidden");
    bookmarkSearchSectionEl.classList.replace("hidden", "grid");
  } else {
    bookmarkSearchSectionEl.classList.replace("grid", "hidden");
    searchSectionEl.classList.replace("hidden", "grid");
  }
};
