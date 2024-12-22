import { Config } from "src/utils/config";
import { usernameInputEl } from "src/options/scripts/ui";

export const fillUserInputs = (config: Config) => {
  usernameInputEl.value = config.user.name;
};
