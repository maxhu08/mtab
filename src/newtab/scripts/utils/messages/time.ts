import { getLanguage } from "~/src/i18n";

export const setTimeMessage = (
  messageEl: HTMLParagraphElement,
  format: "12hr" | "24hr" = "12hr"
) => {
  messageEl.textContent = new Intl.DateTimeFormat(getLanguage(), {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: format === "12hr"
  }).format(new Date());
};