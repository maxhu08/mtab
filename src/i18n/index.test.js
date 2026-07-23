import { describe, expect, test } from "bun:test";
import {
  fillLocalizedDefaultValue,
  normalizeDefaultValue,
  resolveLanguage,
  translate
} from "./index.ts";
import { de } from "./locales/de.ts";
import { es } from "./locales/es.ts";
import { fr } from "./locales/fr.ts";
import { it } from "./locales/it.ts";
import { ja } from "./locales/ja.ts";
import { ko } from "./locales/ko.ts";
import { ptBR } from "./locales/pt-br.ts";
import { zhCN } from "./locales/zh-cn.ts";

const messages = { de, es, fr, it, ja, ko, "pt-BR": ptBR, "zh-CN": zhCN };

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
    expect(resolveLanguage("it", "en-US")).toBe("it");
    expect(resolveLanguage("ja", "en-US")).toBe("ja");
    expect(resolveLanguage("ko", "en-US")).toBe("ko");
    expect(resolveLanguage("pt-BR", "en-US")).toBe("pt-BR");
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
    expect(resolveLanguage(undefined, "it-IT")).toBe("it");
    expect(resolveLanguage(undefined, "ja-JP")).toBe("ja");
    expect(resolveLanguage(undefined, "ko-KR")).toBe("ko");
  });

  test("uses Brazilian Portuguese for Portuguese browser locales", () => {
    expect(resolveLanguage(undefined, "pt")).toBe("pt-BR");
    expect(resolveLanguage(undefined, "pt-BR")).toBe("pt-BR");
    expect(resolveLanguage(undefined, "pt_PT")).toBe("pt-BR");
  });

  test("falls back to English", () => {
    expect(resolveLanguage(undefined, "en-US")).toBe("en");
    expect(resolveLanguage("invalid", "nl-NL")).toBe("en");
    expect(resolveLanguage("toString", "nl-NL")).toBe("en");
  });
});

describe("translations", () => {
  test("only normalizes values known to originate from a default", () => {
    let handleInput;
    const input = {
      value: "",
      dataset: {},
      addEventListener: (_event, listener) => {
        handleInput = listener;
      }
    };

    fillLocalizedDefaultValue(input, "user", "user");
    expect(input.value).toBe("user");
    expect(input.dataset.localizedDefault).toBe("user");

    handleInput();
    expect(input.dataset.localizedDefault).toBeUndefined();

    fillLocalizedDefaultValue(input, "Benutzer", "user");
    expect(input.value).toBe("Benutzer");
    expect(input.dataset.localizedDefault).toBeUndefined();
    expect(normalizeDefaultValue("Benutzer", "user")).toBe("Benutzer");
    expect(normalizeDefaultValue("Benutzer", "user", "Benutzer")).toBe("user");
    expect(normalizeDefaultValue("custom", "user", "Benutzer")).toBe("custom");
  });

  test("keeps English and translates every supported language", () => {
    expect(translate("en", "changes saved")).toBe("changes saved");
    expect(translate("de", "changes saved")).toBe("Änderungen gespeichert");
    expect(translate("es", "changes saved")).toBe("cambios guardados");
    expect(translate("fr", "changes saved")).toBe("Modifications enregistrées");
    expect(translate("it", "changes saved")).toBe("modifiche salvate");
    expect(translate("ja", "changes saved")).toBe("変更を保存しました");
    expect(translate("ko", "changes saved")).toBe("변경 사항이 저장되었습니다");
    expect(translate("pt-BR", "changes saved")).toBe("alterações salvas");
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

  test("preserves functional command and shortcut literals in every locale", () => {
    const requiredLiterals = {
      "Shows the current date when you type 'date'": ["date"],
      "e.g., `morning def` or `morning definition`": ["morning def", "morning definition"],
      "Type `pw <length> <flags>` or `password <length> <flags>` to generate a password": [
        "pw",
        "password"
      ],
      "e.g., `password 16 luns` generates a 16 character password with lowercase letters, uppercase letters, numbers, and symbols":
        ["password 16 luns"],
      "if no arguments are specified, defaults to `16 luns`": ["16 luns"],
      "Modifier keys are specified as `<c-x>`, `<m-x>`, and `<a-x>` for `ctrl+x`, `meta+x`, and `alt+x`. Combined modifiers are written like `<c-a-x>` or `<c-m-x>`. Use `<space>` for the space key.":
        ["<c-x>", "<m-x>", "<a-x>", "ctrl+x", "meta+x", "alt+x", "<c-a-x>", "<c-m-x>", "<space>"],
      "`l` - lowercase letters": ["`l`"],
      "`u` - uppercase letters": ["`u`"],
      "`n` - numbers": ["`n`"],
      "`s` - symbols": ["`s`"],
      "`m` - memorable": ["`m`"]
    };

    Object.values(messages).forEach((locale) => {
      Object.entries(requiredLiterals).forEach((entry) => {
        entry[1].forEach((literal) => {
          expect(locale[entry[0]]).toContain(literal);
        });
      });

      const pagination =
        locale[
          "When enabled, bookmark rows beyond maxBookmarkRowsPerPage are split into extra pages. Use the Prev/Next buttons or [ and ] keys to move between pages."
        ];
      expect(pagination.replaceAll("`", "")).toMatch(/\[\s+\S+\s+\]/u);
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