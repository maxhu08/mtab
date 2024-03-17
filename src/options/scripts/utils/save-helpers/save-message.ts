import { Config } from "src/newtab/scripts/config";
import { messageFontInputEl } from "src/options/scripts/ui";

export const saveMessageSettingsToDraft = (draft: Config) => {
  draft.message.font = messageFontInputEl.value;
};
