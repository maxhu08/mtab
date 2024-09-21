import { Config } from "src/newtab/scripts/config";
import { searchInputEl } from "src/newtab/scripts/ui";
import { hideAssist, displayAssist } from "src/newtab/scripts/utils/assistant-utils";

export const listenToSearch = (config: Config) => {
  chrome.history.search(
    {
      text: "",
      maxResults: 1000
    },
    (history) => {
      console.log(history);

      searchInputEl.oninput = () => {
        const val = searchInputEl.value;

        if (val === "") {
          hideAssist();
        } else {
          const matchingItems = history
            .filter((h) => h.title?.toLocaleLowerCase().startsWith(val.toLowerCase()))
            .slice(0, 6);

          console.log(val, matchingItems);
          if (matchingItems.length > 0) {
            displayAssist([{ type: "history", historyItems: matchingItems }], config);
          } else hideAssist();
        }
      };
    }
  );
};
