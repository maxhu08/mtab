import { getConfig } from "src/newtab/scripts/config";

export const exportConfig = () => {
  getConfig(({ config }) => {
    const save = JSON.stringify(config);

    navigator.clipboard
      .writeText(save)
      .then(() => {
        alert("config saved to clipboard (╯✧▽✧)╯");
      })
      .catch((err) => {
        alert("could not config saved to clipboard (>_<)");
      });
  });
};
