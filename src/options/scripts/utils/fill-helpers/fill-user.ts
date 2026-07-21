import { Config } from "~/src/utils/config";
import { usernameInputEl } from "~/src/options/scripts/ui";
import { localizeDefaultValue } from "~/src/i18n";

export const fillUserInputs = (config: Config) => {
  usernameInputEl.value = localizeDefaultValue(config.user.name, "user");
};