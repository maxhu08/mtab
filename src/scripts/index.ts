// config
import { config } from "src/scripts/config";

// ui
import { searchInputEl } from "src/scripts/ui";

// utils
import { setMessage } from "src/scripts/utils/set-message";
import { setTitle } from "src/scripts/utils/set-title";
import { unfocusSearch } from "src/scripts/utils/unfocus-search";
import { focusSearch } from "src/scripts/utils/focus-search";

// initial page load
setTitle(config.title);
setMessage(`Hello, ${config.user.name}`);

document.addEventListener("keydown", (e) => {
  if (e.key === " ") focusSearch(e);
  if (e.key === "Escape") unfocusSearch();
});

searchInputEl.addEventListener("blur", () => {
  unfocusSearch();
});

searchInputEl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    window.location.href = `https://duckduckgo.com/?q=${searchInputEl.value}`;
  }
});
