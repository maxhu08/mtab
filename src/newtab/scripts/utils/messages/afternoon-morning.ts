import { t } from "~/src/i18n";

export const setMorningAfternoonMessage = (messageEl: HTMLParagraphElement, name: string) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  messageEl.textContent =
    currentHour < 12
      ? t("Good morning, {name}", { name })
      : currentHour < 18
        ? t("Good afternoon, {name}", { name })
        : t("Good evening, {name}", { name });
};