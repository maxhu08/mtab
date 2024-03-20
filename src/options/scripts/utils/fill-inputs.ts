import { getConfig } from "src/newtab/scripts/config";
import { fillAnimationsInputs } from "src/options/scripts/utils/fill-helpers/fill-animations";
import { fillMessageInputs } from "src/options/scripts/utils/fill-helpers/fill-message";
import { fillSearchInputs } from "src/options/scripts/utils/fill-helpers/fill-search";
import { fillTitleInputs } from "src/options/scripts/utils/fill-helpers/fill-title";
import { fillUIStyleInputs } from "src/options/scripts/utils/fill-helpers/fill-ui-style";
import { fillUserInputs } from "src/options/scripts/utils/fill-helpers/fill-user";
import { fillWallpapersInputs } from "src/options/scripts/utils/fill-helpers/fill-wallpapers";

export const fillInputs = () => {
  getConfig(({ config }) => {
    fillUserInputs(config);

    fillTitleInputs(config);

    fillMessageInputs(config);

    fillWallpapersInputs(config);

    fillUIStyleInputs(config);

    fillAnimationsInputs(config);

    fillSearchInputs(config);
  });
};
