export const navigateTab = (direction: "right" | "left") => {
  if (direction === "right") {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const activeTabIndex = tabs.findIndex((tab) => tab.active);
      const nextTabIndex = (activeTabIndex + 1) % tabs.length;
      chrome.tabs.update(tabs[nextTabIndex].id!, { active: true });
    });
  } else if (direction === "left") {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const activeTabIndex = tabs.findIndex((tab) => tab.active);
      const nextTabIndex = (activeTabIndex - 1) % tabs.length;
      chrome.tabs.update(tabs[nextTabIndex].id!, { active: true });
    });
  }
};
