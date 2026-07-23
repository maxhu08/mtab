import { getLanguage } from "~/src/i18n";

export const setDateMessage = (messageEl: HTMLParagraphElement) => {
  messageEl.textContent = new Intl.DateTimeFormat(getLanguage(), {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());
};