import { describe, expect, test } from "bun:test";
import { resolveLanguage, translate } from "./index.ts";
import { de } from "./locales/de.ts";
import { es } from "./locales/es.ts";
import { fr } from "./locales/fr.ts";
import { zhCN } from "./locales/zh-cn.ts";

const messages = { de, es, fr, "zh-CN": zhCN };

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const decode = (value) =>
  value
    .split("&lt;")
    .join("<")
    .split("&gt;")
    .join(">")
    .split("&nbsp;")
    .join(" ")
    .split("&amp;")
    .join("&");

const ignoredStaticText = new Set([
  "mtab",
  "/",
  "github",
  "|",
  "v",
  "open-meteo.com",
  "°F",
  "°C",
  "picsum.photos",
  "duckduckgo",
  "google",
  "bing",
  "brave",
  "yahoo",
  "yandex",
  "startpage",
  "ecosia",
  "kagi",
  "https://github.com/open-dictionary/english-dictionary",
  "hexarate.paikama.co",
  "remixicon:",
  "remixicon.com",
  "(using v4.9.1)",
  "ri-...",
  "nerdfonts:",
  "nerdfonts.com",
  "nf-...",
  "fontawesome:",
  "fontawesome.com",
  "(using v7.1.0)",
  "fa-... fa-...",
  "simpleicons:",
  "icones.js.org",
  "si-...",
  "url:",
  "url-https://...",
  "`https://www.google.com/search?q={}`",
  "Discord",
  "🚀",
  "...",
  "->",
  "//"
]);

const findMissingStaticText = async (path) => {
  const html = await Bun.file(new URL(path, import.meta.url)).text();
  const text = [...html.matchAll(/(?:^|>)([^<]+)(?=<|$)/g)]
    .map((match) => normalize(decode(match[1])))
    .filter(Boolean);
  const attributes = [...html.matchAll(/\b(?:alt|aria-label|placeholder|title)="([^"]+)"/g)].map(
    (match) => normalize(decode(match[1]))
  );

  return [...new Set([...text, ...attributes])].filter(
    (value) => !Object.prototype.hasOwnProperty.call(zhCN, value) && !ignoredStaticText.has(value)
  );
};

describe("options language resolution", () => {
  test("uses a stored supported language first", () => {
    expect(resolveLanguage("en", "zh-CN")).toBe("en");
    expect(resolveLanguage("zh-CN", "en-US")).toBe("zh-CN");
  });

  test("uses Simplified Chinese for Chinese browser locales", () => {
    expect(resolveLanguage(undefined, "zh")).toBe("zh-CN");
    expect(resolveLanguage(undefined, "zh-CN")).toBe("zh-CN");
    expect(resolveLanguage(undefined, "zh-TW")).toBe("zh-CN");
  });

  test("uses supported browser locales", () => {
    expect(resolveLanguage(undefined, "de-DE")).toBe("de");
    expect(resolveLanguage(undefined, "es-419")).toBe("es");
    expect(resolveLanguage(undefined, "fr-CA")).toBe("fr");
  });

  test("falls back to English", () => {
    expect(resolveLanguage(undefined, "en-US")).toBe("en");
    expect(resolveLanguage("invalid", "it-IT")).toBe("en");
    expect(resolveLanguage("toString", "it-IT")).toBe("en");
  });
});

describe("translations", () => {
  test("keeps English and translates every supported language", () => {
    expect(translate("en", "changes saved")).toBe("changes saved");
    expect(translate("de", "changes saved")).toBe("Änderungen gespeichert");
    expect(translate("es", "changes saved")).toBe("cambios guardados");
    expect(translate("fr", "changes saved")).toBe("modifications enregistrées");
    expect(translate("zh-CN", "changes saved")).toBe("更改已保存");
  });

  test("substitutes all message values", () => {
    expect(
      translate("zh-CN", "imported {bookmarks} bookmarks and {folders} folders", {
        bookmarks: 2,
        folders: 1
      })
    ).toBe("已导入 2 个书签和 1 个文件夹");
  });

  test("keeps every locale complete and non-empty", () => {
    Object.values(messages).forEach((locale) => {
      expect(Object.keys(locale)).toEqual(Object.keys(zhCN));
      expect(Object.values(locale).every((value) => value.trim().length > 0)).toBe(true);
    });
  });

  test("preserves interpolation placeholders in every locale", () => {
    const placeholders = (value) =>
      [...value.matchAll(/\{[^{}]+\}/g)].map((match) => match[0]).sort();

    Object.values(messages).forEach((locale) => {
      Object.keys(zhCN).forEach((key) => {
        expect(placeholders(locale[key])).toEqual(placeholders(key));
      });
    });
  });

  test("preserves technical tokens in every locale", () => {
    const tokens = (value) =>
      [...value.matchAll(/https?:\/\/[^\s)`]+|MTAB_[A-Za-z0-9_.#]+|\\[A-Za-z]+[$%]?|\{\}/g)]
        .map((match) => match[0])
        .sort();

    Object.values(messages).forEach((locale) => {
      Object.keys(zhCN).forEach((key) => {
        expect(tokens(locale[key])).toEqual(tokens(key));
        expect(locale[key]).not.toContain("[[[");
      });
    });
  });

  test("covers static text and translatable attributes on every extension page", async () => {
    expect(await findMissingStaticText("../options.html")).toEqual([]);
    expect(await findMissingStaticText("../index.html")).toEqual([]);
    expect(await findMissingStaticText("../popup.html")).toEqual([]);
  });
});

describe("extension entrypoints", () => {
  test("avoid top-level await because Parcel wraps entries in non-async functions", async () => {
    const paths = ["../newtab/scripts/init.ts", "../options/scripts/init.ts", "../popup/popup.ts"];
    const sources = await Promise.all(
      paths.map((path) => Bun.file(new URL(path, import.meta.url)).text())
    );

    expect(paths.filter((_, index) => /^await\b/m.test(sources[index]))).toEqual([]);
  });
});