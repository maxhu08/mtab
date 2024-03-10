document.getElementById("options-button")!.addEventListener("click", () => {
  console.log("test");

  if (typeof chrome === "undefined") return;

  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});
