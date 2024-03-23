import { fillInputs } from "src/options/scripts/utils/fill-inputs";
import { listenToKeys } from "src/options/scripts/keybinds";
import { listenToInputs } from "src/options/scripts/inputs";
import { handleWallpaperFileUpload } from "src/options/scripts/utils/file-upload";
import { getConfig } from "src/newtab/scripts/config";

getConfig(({ config }) => {
  fillInputs(config);
});
listenToInputs();
listenToKeys();
handleWallpaperFileUpload();
