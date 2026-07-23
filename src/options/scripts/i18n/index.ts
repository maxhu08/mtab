import { getLanguages, initializeDocumentI18n, isLanguage } from "~/src/i18n";

export { t } from "~/src/i18n";

const initializeLanguageSelect = () => {
  const select = document.getElementById("options-language-select") as HTMLSelectElement;

  getLanguages().forEach((locale) => {
    const option = document.createElement("option");
    option.value = locale.value;
    option.textContent = `${locale.flag}  ${locale.label}`;
    option.selected = document.documentElement.lang === locale.value;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    if (!isLanguage(select.value)) return;

    chrome.storage.local.set({ optionsLanguage: select.value }, () => window.location.reload());
  });
};

export const initializeI18n = async () => {
  await initializeDocumentI18n();
  initializeLanguageSelect();
};