import { de } from "~/src/i18n/locales/de";
import { es } from "~/src/i18n/locales/es";
import { fr } from "~/src/i18n/locales/fr";
import { it } from "~/src/i18n/locales/it";
import { ja } from "~/src/i18n/locales/ja";
import { ko } from "~/src/i18n/locales/ko";
import { ptBR } from "~/src/i18n/locales/pt-br";
import { zhCN } from "~/src/i18n/locales/zh-cn";

const locales = {
  en: {
    flag: "🇺🇸",
    label: "English"
  },
  de: {
    flag: "🇩🇪",
    label: "Deutsch",
    messages: de
  },
  es: {
    flag: "🇪🇸",
    label: "Español",
    messages: es
  },
  fr: {
    flag: "🇫🇷",
    label: "Français",
    messages: fr
  },
  it: {
    flag: "🇮🇹",
    label: "Italiano",
    messages: it
  },
  ja: {
    flag: "🇯🇵",
    label: "日本語",
    messages: ja
  },
  ko: {
    flag: "🇰🇷",
    label: "한국어",
    messages: ko
  },
  "pt-BR": {
    flag: "🇧🇷",
    label: "Português (Brasil)",
    messages: ptBR
  },
  "zh-CN": {
    flag: "🇨🇳",
    label: "简体中文",
    messages: zhCN
  }
} as const;

export type Language = keyof typeof locales;
export type TranslationKey = keyof typeof zhCN;

let language: Language = "en";

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(locales, value);

export const resolveLanguage = (storedLanguage: unknown, browserLanguage: string): Language => {
  if (isLanguage(storedLanguage)) return storedLanguage;

  const normalizedBrowserLanguage = browserLanguage.replace("_", "-").toLowerCase();
  const browserBaseLanguage = normalizedBrowserLanguage.split("-")[0];

  if (browserBaseLanguage === "zh") return "zh-CN";
  if (browserBaseLanguage === "pt") return "pt-BR";
  if (isLanguage(browserBaseLanguage)) return browserBaseLanguage;
  return "en";
};

export const getLanguage = () => language;

export const getLanguages = () =>
  Object.keys(locales).map((value) => ({
    value: value as Language,
    flag: locales[value as Language].flag,
    label: locales[value as Language].label
  }));

export const translate = (
  targetLanguage: Language,
  key: TranslationKey,
  values: Record<string, string | number> = {}
) => {
  const locale = locales[targetLanguage];
  const message = "messages" in locale ? locale.messages[key] : key;

  return Object.entries(values).reduce(
    (result, entry) => result.split(`{${entry[0]}}`).join(String(entry[1])),
    message as string
  );
};

export const t = (key: TranslationKey, values: Record<string, string | number> = {}) =>
  translate(language, key, values);

export const localizeDefaultValue = (value: string, key: TranslationKey) =>
  value === key ? t(key) : value;

const localizedDefaultInputs = new WeakSet<HTMLInputElement | HTMLTextAreaElement>();

export const fillLocalizedDefaultValue = (
  input: HTMLInputElement | HTMLTextAreaElement,
  value: string,
  key: TranslationKey
) => {
  input.value = localizeDefaultValue(value, key);
  if (value === key) input.dataset.localizedDefault = input.value;
  else delete input.dataset.localizedDefault;

  if (localizedDefaultInputs.has(input)) return;
  input.addEventListener("input", () => delete input.dataset.localizedDefault);
  localizedDefaultInputs.add(input);
};

export const normalizeDefaultValue = (
  value: string,
  key: TranslationKey,
  localizedDefault?: string
) => (value === localizedDefault ? key : value);

const isTranslationKey = (value: string): value is TranslationKey =>
  Object.prototype.hasOwnProperty.call(zhCN, value);

const translateText = (node: Text) => {
  const source = normalize(node.textContent ?? "");
  if (!isTranslationKey(source)) return;

  const leading = node.textContent?.match(/^\s*/)?.[0] ?? "";
  const trailing = node.textContent?.match(/\s*$/)?.[0] ?? "";
  node.textContent = `${leading}${t(source)}${trailing}`;
};

const translateAttribute = (el: Element, attribute: string) => {
  const source = normalize(el.getAttribute(attribute) ?? "");
  if (isTranslationKey(source)) el.setAttribute(attribute, t(source));
};

export const translateDocument = () => {
  document.documentElement.lang = language;

  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node as Text);
  nodes.forEach(translateText);

  document
    .querySelectorAll("[alt], [aria-label], [placeholder], [title], [data-tippy-content]")
    .forEach((el) => {
      translateAttribute(el, "alt");
      translateAttribute(el, "aria-label");
      translateAttribute(el, "placeholder");
      translateAttribute(el, "title");
      translateAttribute(el, "data-tippy-content");
    });
};

export const initializeLanguage = () =>
  new Promise<void>((resolve) => {
    chrome.storage.local.get(["optionsLanguage"], (data) => {
      language = resolveLanguage(data.optionsLanguage, chrome.i18n.getUILanguage());
      resolve();
    });
  });

export const initializeDocumentI18n = async () => {
  await initializeLanguage();
  translateDocument();
};