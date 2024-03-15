import { Config } from "src/newtab/scripts/config";
import { titleInputEl } from "src/options/scripts/ui";

export const saveTitleToDraft = (draft: Config) => {
  draft.title = titleInputEl.value;
};
