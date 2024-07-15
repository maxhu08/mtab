const logo = document.getElementById("mtab-logo") as HTMLImageElement;

logo.classList.add("animate-up-bouncy");

logo.addEventListener(
  "animationend",
  () => {
    logo.classList.replace("animate-up-bouncy", "animate-float");
  },
  {
    once: true
  }
);

document.getElementById("options-button")!.addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
    return;
  } else {
    window.open(chrome.runtime.getURL("options.html"));
    return;
  }
});
