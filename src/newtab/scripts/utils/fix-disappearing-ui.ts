import { AnimationBookmarkType, AnimationSearchType } from "src/newtab/scripts/config";
import { contentEl } from "src/newtab/scripts/ui";

export const fixDisappearingUI = () => {
  // for user clicks on bookmark ui disappears
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      window.location.reload();
    }
  });
};
