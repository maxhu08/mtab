import { listenToKeys } from "src/options/scripts/keybinds";
import { handleWallpaperFileUpload } from "src/options/scripts/utils/file-upload";
import { fillInputs } from "src/options/scripts/utils/fill-inputs";

fillInputs();
listenToKeys();
handleWallpaperFileUpload();
