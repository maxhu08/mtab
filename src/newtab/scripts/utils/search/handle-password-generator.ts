import { AssistPasswordGenerator } from "src/newtab/scripts/utils/search/search-assist-utils";

export const handlePasswordGenerator = (val: string) => {
  if (!/^\s*password\b/i.test(val)) return undefined;

  const rest = val.replace(/^\s*password\b/i, " ");
  const lenMatch = rest.match(/\b(\d+)\b/);
  const length = lenMatch ? Math.max(1, Math.min(4096, Number(lenMatch[1]))) : 16;

  const rawFlags = (rest.match(/[mnuls]/gi) ?? []).map((c) => c.toLowerCase());
  const hasAnyFlags = rawFlags.length > 0;
  const flags = new Set(rawFlags);

  const memorable = flags.has("m");

  const allowLowercase = hasAnyFlags ? flags.has("l") : true;
  const allowUppercase = hasAnyFlags ? flags.has("u") : true;
  const allowNumbers = hasAnyFlags ? flags.has("n") : true;
  const allowSymbols = hasAnyFlags ? flags.has("s") : true;

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
    for (let i = 0; i < length; i++) {
      out += charset[randInt(charset.length)];
    }
    return out;
  };

  const WORDS = [
    "amber",
    "apple",
    "arch",
    "arrow",
    "atlas",
    "baker",
    "beach",
    "berry",
    "brave",
    "breeze",
    "canvas",
    "canyon",
    "cedar",
    "comet",
    "coral",
    "dawn",
    "delta",
    "echo",
    "ember",
    "fable",
    "falcon",
    "forest",
    "glacier",
    "harbor",
    "honey",
    "ivory",
    "jungle",
    "karma",
    "lagoon",
    "lunar",
    "maple",
    "meadow",
    "mosaic",
    "nebula",
    "opal",
    "orbit",
    "panda",
    "pearl",
    "pioneer",
    "prairie",
    "quartz",
    "radar",
    "raven",
    "river",
    "sable",
    "sierra",
    "solar",
    "spice",
    "stone",
    "sunset",
    "tango",
    "timber",
    "valor",
    "velvet",
    "whisper",
    "wild",
    "willow",
    "winter",
    "zephyr",
    "zinc"
  ];

  const applyCase = (w: string) => {
    if (allowUppercase && !allowLowercase) return w.toUpperCase();
    if (!allowUppercase && allowLowercase) return w.toLowerCase();
    if (allowUppercase && allowLowercase) {
      const lower = w.toLowerCase();
      return lower[0].toUpperCase() + lower.slice(1);
    }
    return w;
  };

  const makeMemorable = () => {
    const parts: string[] = [];
    let joined = "";

    while (joined.length < length) {
      parts.push(applyCase(WORDS[randInt(WORDS.length)]));
      joined = parts.join("-");
    }

    let out = joined.slice(0, length);

    if (allowNumbers) {
      const pos = randInt(length);
      out = out.slice(0, pos) + digits[randInt(digits.length)] + out.slice(pos + 1);
    }

    if (allowSymbols) {
      const pos = randInt(length);
      out = out.slice(0, pos) + symbols[randInt(symbols.length)] + out.slice(pos + 1);
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
