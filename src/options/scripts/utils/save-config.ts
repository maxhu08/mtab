import { saveName } from "src/options/scripts/utils/save-name";
import { saveTitle } from "src/options/scripts/utils/save-title";

export const saveConfig = () => {
  saveTitle(saveName);
};
