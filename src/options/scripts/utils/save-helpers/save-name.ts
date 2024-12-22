import { Config } from "src/utils/config";
import { usernameInputEl } from "src/options/scripts/ui";

export const saveNameToDraft = (draft: Config) => {
  draft.user.name = usernameInputEl.value;
};
