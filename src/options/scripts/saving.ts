import { usernameInputEl } from "src/options/scripts/ui";

export const saveName = () => {
  const name = usernameInputEl.value;

  chrome.storage.local.set({
    config: {
      title: "new tab",
      dynamicTitle: true, // changes when typing in search bar
      animations: {
        enabled: "on",
        animationClass: "animate-up-bouncy"
      },
      user: {
        name
      },
      search: {
        engine: "duckduckgo",
        focusedBorderClass: "border-blue-500",
        activationKey: " "
      },
      closePageKey: "x",
      // TODO: bookmarks activation key
      bookmarks: []
    }
  });
};
