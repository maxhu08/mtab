import { convertInTextareaEl, convertOutTextareaEl } from "src/config-utils/scripts/ui";

export const convertSave = () => {
  // prettier-ignore
  const selectedModeEl = document.querySelector(`button[btn-option-type="convert-mode"][selected="yes"]`) as HTMLButtonElement;
  const selectedModePairs: Record<string, "mtj" | "jtm"> = {
    "convert-mtj-button": "mtj",
    "convert-jtm-button": "jtm"
  };
  const selectedMode = selectedModePairs[selectedModeEl.id];
  const inputVal = convertInTextareaEl.value;

  if (inputVal === "") {
    toast.error("input is empty");
    return;
  }

  const prefix = "MTAB_SAVE_FORMAT_";
  if (selectedMode === "mtj") {
    if (!inputVal.startsWith(prefix)) {
      toast.error("incorrect save format, should be MTAB_SAVE_FORMAT");
      return;
    }

    const saveAsJson = JSON.parse(decodeURIComponent(window.atob(inputVal.replace(prefix, ""))));

    convertOutTextareaEl.value = JSON.stringify(JSON.parse(saveAsJson), null, 2);
  } else if (selectedMode === "jtm") {
    if (inputVal.startsWith(prefix)) {
      toast.error("incorrect save format, should be json");
      return;
    }

    const saveAsMtabFormat = `MTAB_SAVE_FORMAT_${window.btoa(encodeURIComponent(JSON.stringify(inputVal)))}`;

    convertOutTextareaEl.value = saveAsMtabFormat;
  }
};
