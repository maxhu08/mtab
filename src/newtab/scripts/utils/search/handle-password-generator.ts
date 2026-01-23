import { WORDS } from "src/newtab/scripts/utils/search/password-generator-words";
import { AssistPasswordGenerator } from "src/newtab/scripts/utils/search/search-assist-utils";

export const handlePasswordGenerator = (val: string) => {
  if (!/^\s*(?:password|pw)\b/i.test(val)) return undefined;

  const rest = val.replace(/^\s*(?:password|pw)\b/i, " ");
  const lenMatch = rest.match(/\b(\d+)\b/);
  const length = lenMatch ? Math.max(1, Math.min(4096, Number(lenMatch[1]))) : 16;

  const rawFlags = (rest.match(/[mnuls]/gi) ?? []).map((c) => c.toLowerCase());
  const hasAnyFlags = rawFlags.length > 0;
  const flags = new Set(rawFlags);

  const allowLowercase = hasAnyFlags ? flags.has("l") : true;
  const allowUppercase = hasAnyFlags ? flags.has("u") : true;
  const allowNumbers = hasAnyFlags ? flags.has("n") : true;
  const allowSymbols = hasAnyFlags ? flags.has("s") : true;

  const memorable = flags.has("m");

  const cryptoObj: Crypto | undefined =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof crypto !== "undefined" ? crypto : (globalThis as any).crypto;

  const randInt = (maxExclusive: number) => {
    if (maxExclusive <= 0) return 0;
    if (!cryptoObj?.getRandomValues) return Math.floor(Math.random() * maxExclusive);

    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;

    for (;;) {
      cryptoObj.getRandomValues(buf);
      const x = buf[0];
      if (x < limit) return x % maxExclusive;
    }
  };

  const digits = "0123456789";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*()-_=+[]{};:,.?";

  const buildCharset = () => {
    let s = "";
    if (allowLowercase) s += lowercase;
    if (allowUppercase) s += uppercase;
    if (allowNumbers) s += digits;
    if (allowSymbols) s += symbols;
    return s;
  };

  const makeRandom = () => {
    const charset = buildCharset();
    let out = "";
    for (let i = 0; i < length; i++) out += charset[randInt(charset.length)];
    return out;
  };

  const applyCase = (w: string) => {
    if (allowUppercase && !allowLowercase) return w.toUpperCase();
    if (!allowUppercase && allowLowercase) return w.toLowerCase();
    if (allowUppercase && allowLowercase) {
      const lower = w.toLowerCase();
      return lower[0].toUpperCase() + lower.slice(1);
    }
    return w;
  };

  const insertAtBoundary = (out: string, boundaries: number[], ch: string) => {
    const pickable = boundaries.filter((b) => b > 0 && b < out.length);
    const pos = pickable.length > 0 ? pickable[randInt(pickable.length)] : out.length;

    const inserted = out.slice(0, pos) + ch + out.slice(pos);
    return inserted.length > length ? inserted.slice(0, length) : inserted;
  };

  const makeMemorable = () => {
    const parts: string[] = [];
    const boundaries: number[] = [];
    let joined = "";
    let accLen = 0;

    while (joined.length < length) {
      const w = applyCase(WORDS[randInt(WORDS.length)]);
      parts.push(w);
      accLen += w.length;
      boundaries.push(accLen);
      joined = parts.join("");
    }

    let out = joined.slice(0, length);
    let sliceBoundaries = boundaries.filter((b) => b > 0 && b < length);

    if (allowNumbers) {
      const maxDigits = Math.max(1, Math.floor(Math.sqrt(length)));
      const digitCount = 1 + randInt(maxDigits); // [1, sqrt(length)]

      for (let i = 0; i < digitCount; i++) {
        out = insertAtBoundary(out, sliceBoundaries, digits[randInt(digits.length)]);
        sliceBoundaries = sliceBoundaries.map((b) => (b >= out.length ? b : b + 1));
      }
    }

    if (allowSymbols) {
      out = insertAtBoundary(out, sliceBoundaries, symbols[randInt(symbols.length)]);
    }

    return out;
  };

  const result = memorable ? makeMemorable() : makeRandom();

  return {
    type: "password-generator",
    result,
    flags: {
      allowLowercase,
      allowUppercase,
      allowNumbers,
      allowSymbols,
      memorable
    }
  } satisfies AssistPasswordGenerator;
};
