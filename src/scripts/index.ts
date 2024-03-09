import { config } from "src/scripts/config";
import { setMessage } from "src/scripts/utils/set-message";
import { setTitle } from "src/scripts/utils/set-title";

// initial page load
setTitle(config.title);
setMessage(`Hello, ${config.user.name}`);

const searchEl = document.getElementById("search") as HTMLInputElement;
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    if (searchEl.matches(":focus")) return;
    e.preventDefault();

    searchEl.focus();
  }
});

searchEl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    window.location.href = `https://duckduckgo.com/?q=${searchEl.value}`;
  }
});
