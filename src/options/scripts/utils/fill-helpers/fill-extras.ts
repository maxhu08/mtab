import { Config, SnowEnabledType } from "src/newtab/scripts/config";
import {
  extrasSnowEnabledOff,
  extrasSnowEnabledOn,
  extrasSnowEnabledWinter
} from "src/options/scripts/ui";

export const fillExtrasInputs = (config: Config) => {
  const extrasSnowEnabledPairs: Record<SnowEnabledType, HTMLButtonElement> = {
    on: extrasSnowEnabledOn,
    winter: extrasSnowEnabledWinter,
    off: extrasSnowEnabledOff
  };
  extrasSnowEnabledPairs[config.extras.snow.enabled].click();
};
