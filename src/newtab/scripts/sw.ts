export const initSW = () => {
  chrome.runtime.sendMessage({ type: "w" });
};
