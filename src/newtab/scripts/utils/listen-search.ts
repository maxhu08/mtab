import { searchInputEl } from "src/newtab/scripts/ui";

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

        if (val !== "") {
          const matchingItems = history.filter((h) =>
            h.title?.toLocaleLowerCase().startsWith(val.toLowerCase())
          );

          console.log(val, matchingItems);
        }
      };
    }
  );
};
