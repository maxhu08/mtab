document.getElementById("options-button")!.addEventListener("click", () => {
  if (browser.runtime.openOptionsPage) {
    browser.runtime.openOptionsPage();
  }

  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});
