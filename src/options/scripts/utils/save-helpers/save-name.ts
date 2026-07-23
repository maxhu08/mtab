import { Config } from "~/src/utils/config";
import { usernameInputEl } from "~/src/options/scripts/ui";
import { normalizeDefaultValue } from "~/src/i18n";

export const saveNameToDraft = (draft: Config) => {
  draft.user.name = normalizeDefaultValue(
    usernameInputEl.value,
    "user",
    usernameInputEl.dataset.localizedDefault
  );
};