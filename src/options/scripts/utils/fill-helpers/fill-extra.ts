import { Config, SnowEnabledType } from "src/newtab/scripts/config";
import {
  extraSnowEnabledOff,
  extraSnowEnabledOn,
  extraSnowEnabledWinter
} from "src/options/scripts/ui";

export const fillExtraInputs = (config: Config) => {
  const extraSnowEnabledPairs: Record<SnowEnabledType, HTMLButtonElement> = {
    on: extraSnowEnabledOn,
    winter: extraSnowEnabledWinter,
    off: extraSnowEnabledOff
  };
  extraSnowEnabledPairs[config.extra.snow.enabled].click();
};
