import { Config } from "src/newtab/scripts/config";
import { fillAnimationsInputs } from "src/options/scripts/utils/fill-helpers/fill-animations";
import { fillBookmarksInputs } from "src/options/scripts/utils/fill-helpers/fill-bookmarks";
import { fillExtraInputs } from "src/options/scripts/utils/fill-helpers/fill-extra";
import { fillHotkeysInputs } from "src/options/scripts/utils/fill-helpers/fill-hotkeys";
import { fillMessageInputs } from "src/options/scripts/utils/fill-helpers/fill-message";
import { fillOptionsInputs } from "src/options/scripts/utils/fill-helpers/fill-options";
import { fillSearchInputs } from "src/options/scripts/utils/fill-helpers/fill-search";
import { fillTitleInputs } from "src/options/scripts/utils/fill-helpers/fill-title";
import { fillUIInputs } from "src/options/scripts/utils/fill-helpers/fill-ui";
import { fillUserInputs } from "src/options/scripts/utils/fill-helpers/fill-user";
import { fillWallpapersInputs } from "src/options/scripts/utils/fill-helpers/fill-wallpapers";

export const fillInputs = (config: Config) => {
  fillOptionsInputs(config);

  fillUserInputs(config);

  fillTitleInputs(config);

  fillMessageInputs(config);

  fillWallpapersInputs(config);

  fillUIInputs(config);

  fillAnimationsInputs(config);

  fillSearchInputs(config);

  fillHotkeysInputs(config);

  fillBookmarksInputs(config);

  fillExtraInputs(config);
};
