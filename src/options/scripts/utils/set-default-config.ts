import { defaultConfig } from "src/newtab/scripts/config";
import { fillInputs } from "src/options/scripts/utils/fill-inputs";

export const setDefaultConfig = () => {
  const confirmReset = window.confirm("do you want to reset your options to default?");

  if (confirmReset) {
    console.log("[RESET_DEBUG]", defaultConfig);
    alert("options reset to default");
    fillInputs(defaultConfig);
  } else {
    alert("you selected no, options did not reset");
  }
};
