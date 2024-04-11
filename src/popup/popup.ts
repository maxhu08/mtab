document.getElementById("options-button")!.addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
    return;
  } else {
    if (browser.runtime.openOptionsPage) {
      browser.runtime.openOptionsPage();
      return;
    }

    window.open(chrome.runtime.getURL("options.html"));
    return;
  }
});
