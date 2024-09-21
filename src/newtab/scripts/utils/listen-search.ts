import { searchInputEl } from "src/newtab/scripts/ui";
import { displayAssist } from "src/newtab/scripts/utils/assistant-utils";

export const listenToSearch = () => {
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
          displayAssist([]);
        } else {
          const matchingItems = history.filter((h) =>
            h.title?.toLocaleLowerCase().startsWith(val.toLowerCase())
          );

          console.log(val, matchingItems);
          displayAssist([{ type: "history", historyItems: matchingItems }]);
        }
      };
    }
  );
};
