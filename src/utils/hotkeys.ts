export const KEY_SEQUENCE_TIMEOUT_MS = 1000;

export type MtabHotkeyAction = "activation" | "close-page" | "search-bookmarks";

export const normalizeStoredHotkey = (value: string): string => {
  return value.replace(/ /g, "<space>").trim();
};

const normalizeBaseKey = (key: string): string | null => {
  if (key === " ") {
    return "<space>";
  }

  if (key.length === 1) {
    return key.toLowerCase();
  }

  return null;
};

export const getKeyToken = (event: KeyboardEvent): string | null => {
  const normalizedKey = normalizeBaseKey(event.key);

  if (!normalizedKey) {
    return null;
  }

  const modifiers: string[] = [];

  if (event.ctrlKey) {
    modifiers.push("c");
  }

  if (event.metaKey) {
    modifiers.push("m");
  }

  if (event.altKey) {
    modifiers.push("a");
  }

  if (modifiers.length > 0) {
    return `<${modifiers.join("-")}-${normalizedKey}>`;
  }

  return normalizedKey;
};

export const createHotkeyPrefixes = (
  mappings: Partial<Record<string, MtabHotkeyAction>>
): Partial<Record<string, true>> => {
  const prefixes: Partial<Record<string, true>> = {};

  for (const sequence of Object.keys(mappings)) {
    for (let index = 1; index < sequence.length; index += 1) {
      prefixes[sequence.slice(0, index)] = true;
    }
  }

  return prefixes;
};
