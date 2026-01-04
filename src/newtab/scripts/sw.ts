export const initSW = () => {
  console.log("i");

  chrome.runtime.sendMessage({ type: "warm" });
};
