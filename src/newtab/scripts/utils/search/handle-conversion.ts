import { AssistConversion } from "~/src/newtab/scripts/utils/search/search-assist-utils";

type Category =
  | "length"
  | "weight"
  | "temperature"
  | "time"
  | "volume"
  | "area"
  | "speed"
  | "angle"
  | "data";

type UnitDef = {
  c: Category;
  u: string;
  a: readonly string[];
  toBase: (n: number) => number;
  fromBase: (n: number) => number;
};

type ConversionResult = {
  type: "conversion";
  before: string;
  after: string[];
};

const PRECISION = 10;

const fmt = (n: number) => n.toFixed(PRECISION).replace(/\.?0+$/, "");

const linear = (c: Category, u: string, a: readonly string[], kToBase: number): UnitDef => ({
  c,
  u,
  a,
  toBase: (n) => n * kToBase,
  fromBase: (n) => n / kToBase
});

// bases:
// length: m, weight: g, temperature: K, time: s, volume: L, area: m^2, speed: m/s, angle: rad, data: B
// prettier-ignore
const UNITS: readonly UnitDef[] = [
  // length (base: m)
  linear("length","mm",   ["mm","millimeter","millimeters"],                  0.001),
  linear("length","cm",   ["cm","centimeter","centimeters"],                  0.01),
  linear("length","m",    ["m","meter","meters"],                             1),
  linear("length","km",   ["km","kilometer","kilometers"],                    1000),
  linear("length","in",   ["in","inch","inches"],                             0.0254),
  linear("length","ft",   ["ft","foot","feet"],                               0.3048),
  linear("length","yd",   ["yd","yard","yards"],                              0.9144),
  linear("length","mi",   ["mi","mile","miles"],                              1609.344),

  // weight (base: g)
  linear("weight","g",    ["g","gram","grams"],                               1),
  linear("weight","mg",   ["mg","milligram","milligrams"],                    0.001),
  linear("weight","kg",   ["kg","kilogram","kilograms"],                      1000),
  linear("weight","oz",   ["oz","ounce","ounces"],                            28.349523125),
  linear("weight","lb",   ["lb","lbs","pound","pounds"],                      453.59237),

  // temperature (base: K)
  { c: "temperature", u: "°F", a: ["f","°f","fahrenheit"], toBase: (n) => ((n - 32) * 5) / 9 + 273.15, fromBase: (n) => ((n - 273.15) * 9) / 5 + 32 },
  { c: "temperature", u: "°C", a: ["c","°c","celsius"],    toBase: (n) => n + 273.15,                    fromBase: (n) => n - 273.15 },
  { c: "temperature", u: "K",  a: ["k","kelvin"],          toBase: (n) => n,                             fromBase: (n) => n },

  // time (base: s)
  linear("time","s",      ["s","sec","secs","second","seconds"],              1),
  linear("time","min",    ["min","mins","minute","minutes"],                  60),
  linear("time","hr",     ["hr","hrs","hour","hours"],                        3600),
  linear("time","d",      ["d","day","days"],                                 86400),
  linear("time","wk",     ["w","wk","wks","week","weeks"],                    604800),
  linear("time","ms",     ["ms","millisecond","milliseconds"],                0.001),

  // volume (base: L)
  linear("volume","mL",   ["ml","milliliter","milliliters"],                  0.001),
  linear("volume","L",    ["l","liter","liters"],                             1),
  linear("volume","tsp",  ["tsp","teaspoon","teaspoons"],                     0.00492892159375),
  linear("volume","tbsp", ["tbsp","tablespoon","tablespoons"],                0.01478676478125),
  linear("volume","cup",  ["cup","cups"],                                     0.2365882365),
  linear("volume","pt",   ["pt","pint","pints"],                              0.473176473),
  linear("volume","qt",   ["qt","quart","quarts"],                            0.946352946),
  linear("volume","gal",  ["gal","gallon","gallons"],                         3.785411784),

  // area (base: m^2)
  linear("area","m^2",    ["m^2","m2","sqm","squaremeter","squaremeters"],     1),
  linear("area","km^2",   ["km^2","km2","sqkm","squarekilometer","squarekilometers"], 1_000_000),
  linear("area","ft^2",   ["ft^2","ft2","sqft","squarefoot","squarefeet"],     0.09290304),
  linear("area","in^2",   ["in^2","in2","sqin","squareinch","squareinches"],   0.00064516),
  linear("area","acre",   ["acre","acres"],                                    4046.8564224),
  linear("area","ha",     ["ha","hectare","hectares"],                         10000),

  // speed (base: m/s)
  linear("speed","m/s",   ["m/s","mps"],                                       1),
  linear("speed","km/h",  ["km/h","kmh","kph"],                                0.2777777777777778),
  linear("speed","mph",   ["mph"],                                             0.44704),
  linear("speed","ft/s",  ["ft/s","fps"],                                      0.3048),
  linear("speed","kt",    ["kt","knot","knots"],                               0.5144444444444445),

  // angle (base: rad)
  { c: "angle", u: "rad", a: ["rad","radian","radians"], toBase: (n) => n,                       fromBase: (n) => n },
  { c: "angle", u: "deg", a: ["deg","degree","degrees","°"], toBase: (n) => (n * Math.PI) / 180, fromBase: (n) => (n * 180) / Math.PI },

  // data (base: B)
  linear("data","B",      ["b","byte","bytes"],                                1),
  linear("data","KB",     ["kb","kB","kilobyte","kilobytes"],                  1e3),
  linear("data","MB",     ["mb","MB","megabyte","megabytes"],                  1e6),
  linear("data","GB",     ["gb","GB","gigabyte","gigabytes"],                  1e9),
  linear("data","TB",     ["tb","TB","terabyte","terabytes"],                  1e12),
  linear("data","KiB",    ["kib","kibibyte","kibibytes"],                      1024),
  linear("data","MiB",    ["mib","mebibyte","mebibytes"],                      1024**2),
  linear("data","GiB",    ["gib","gibibyte","gibibytes"],                      1024**3),
  linear("data","TiB",    ["tib","tebibyte","tebibytes"],                      1024**4),
];

const ALIAS_MAP = (() => {
  const m = new Map<string, UnitDef>();
  for (const u of UNITS) for (const a of u.a) m.set(a.toLowerCase(), u);
  return m;
})();

const findUnit = (token: string) => ALIAS_MAP.get(token.trim().toLowerCase());

const parse = (s: string) => {
  // supports:
  // "12cm", "12 cm", "12 cm to m", "12cm to   m", "12m to "
  const m = s.trim().match(/^(-?\d+(?:\.\d+)?)\s*([a-z°/^\d]+)\s*(?:to\s*([a-z°/^\d]+)?\s*)?$/i);
  if (!m) return null;
  return {
    value: Number(m[1]),
    fromTok: m[2],
    toTok: (m[3] ?? "").trim() || null,
    hasTo: /\bto\b/i.test(s)
  };
};

export const handleConversion = (val: string): ConversionResult | undefined => {
  const p = parse(val);
  if (!p || !Number.isFinite(p.value)) return;

  const from = findUnit(p.fromTok);
  if (!from) return;

  const base = from.toBase(p.value);
  const allInCat = UNITS.filter((u) => u.c === from.c);

  const to = p.toTok ? findUnit(p.toTok) : null;

  // if "to" is present but target unit isn't typed yet ("1m to "), show all
  if (p.hasTo && !p.toTok) {
    const targets = allInCat.filter((u) => u.u !== from.u);
    return {
      type: "conversion",
      before: `${p.value} ${from.u}`,
      after: targets.map((t) => `${fmt(t.fromBase(base))} ${t.u}`)
    };
  }

  // if a target unit is typed, it must exist and be in the same category
  if (p.toTok && (!to || to.c !== from.c)) return;

  const targets = to ? [to] : allInCat.filter((u) => u.u !== from.u);

  return {
    type: "conversion",
    before: `${p.value} ${from.u}`,
    after: targets.map((t) => `${fmt(t.fromBase(base))} ${t.u}`)
  } satisfies AssistConversion;
};
