import { Config } from "~/src/utils/config";
import { usernameInputEl } from "~/src/options/scripts/ui";
import { fillLocalizedDefaultValue } from "~/src/i18n";

export const fillUserInputs = (config: Config) => {
  fillLocalizedDefaultValue(usernameInputEl, config.user.name, "user");
};