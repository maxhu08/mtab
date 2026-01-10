export const recognizeUrl = (input: string): string | null => {
  const s = input.trim();
  if (!s) return null;

  // fast whitespace rejection (ascii only)
  for (let i = 0; i < s.length; i++) {
    if (isAsciiWhitespace(s.charCodeAt(i))) return null;
  }

  // absolute http(s) url
  const abs = tryParseHttpUrl(s);
  if (abs) return abs;

  // split into host + rest without regex
  let cut = s.length;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 47 || c === 63 || c === 35) {
      // '/', '?', '#'
      cut = i;
      break;
    }
  }

  const host = s.slice(0, cut).toLowerCase();
  const rest = s.slice(cut);

  if (!isValidHostAndTld(host)) return null;

  // only now pay the url parsing cost
  return tryParseHttpUrl(`https://${host}${rest}`);
};

const hasUrlParse =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof (URL as any).parse === "function";

const tryParseHttpUrl = (raw: string): string | null => {
  try {
    const u = hasUrlParse
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (URL as any).parse(raw)
      : new URL(raw);

    const p = u.protocol;
    if (p !== "http:" && p !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
};

const isAsciiWhitespace = (c: number) =>
  c === 9 || c === 10 || c === 11 || c === 12 || c === 13 || c === 32;

const isLabelChar = (c: number) =>
  (c >= 48 && c <= 57) || // 0-9
  (c >= 97 && c <= 122) || // a-z
  c === 45; // '-'

const isValidHostAndTld = (hostLower: string): boolean => {
  // must contain at least one dot and not start/end with dot
  const lastDot = hostLower.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === hostLower.length - 1) return false;

  const tld = hostLower.slice(lastDot + 1);
  if (!POPULAR_TLDS.has(tld)) return false;

  let labelLen = 0;
  let labelStart = 0;

  for (let i = 0; i <= hostLower.length; i++) {
    const end = i === hostLower.length;
    const c = end ? 46 : hostLower.charCodeAt(i); // sentinel '.'

    if (c === 46) {
      // close label
      if (labelLen < 1 || labelLen > 63) return false;

      const first = hostLower.charCodeAt(labelStart);
      const last = hostLower.charCodeAt(i - 1);
      if (first === 45 || last === 45) return false;

      labelLen = 0;
      labelStart = i + 1;
      continue;
    }

    if (!isLabelChar(c)) return false;
    labelLen++;
    if (labelLen > 63) return false;
  }

  return true;
};

const POPULAR_TLDS = new Set<string>([
  // Core legacy gTLDs (widely recognized, long-standing)
  "com",
  "net",
  "org",
  "edu",
  "gov",
  "mil",
  "int",
  "info",
  "biz",
  "name",
  "pro",
  "aero",
  "coop",
  "museum",

  // Common “short” and frequently typed
  "co",
  "me",
  "io",
  "to",
  "so",

  // Very popular modern generics (broad usage)
  "xyz",
  "top",
  "vip",
  "win",
  "one",
  "link",
  "page",
  "pages",
  "today",
  "world",
  "life",
  "team",
  "group",
  "community",
  "social",
  "network",
  "networks",

  // Web presence and general online identity
  "online",
  "site",
  "website",
  "web",
  "blog",
  "news",
  "media",
  "press",
  "journal",
  "wiki",
  "docs",
  "doc",
  "email",
  "mail",

  // Commerce and business
  "shop",
  "store",
  "market",
  "shopping",
  "business",
  "company",
  "services",
  "service",
  "solutions",
  "support",
  "help",
  "finance",
  "financial",
  "money",
  "bank",
  "crypto",

  // Tech and developer-heavy
  "app",
  "dev",
  "ai",
  "tech",
  "cloud",
  "systems",
  "software",
  "digital",
  "data",
  "analytics",
  "insights",
  "tools",
  "tool",
  "api",
  "sdk",
  "hosting",
  "server",
  "servers",
  "code",
  "coding",
  "engineer",
  "engineering",
  "security",
  "secure",
  "trust",
  "identity",
  "login",
  "auth",

  // Entertainment and streaming
  "live",
  "video",
  "tv",
  "stream",
  "games",
  "game",
  "play",
  "fun",
  "music",
  "audio",
  "sound",
  "film",
  "movie",
  "cinema",

  // Creative / portfolio
  "design",
  "art",
  "studio",
  "photo",
  "photography",
  "books",
  "book",
  "read",

  // Health and lifestyle
  "care",
  "health",
  "fitness",

  // Food and local business
  "food",
  "cafe",
  "restaurant",
  "bar",
  "pizza",

  // Travel and hospitality
  "travel",
  "tours",
  "hotel",
  "hotels",
  "vacation",

  // Real estate
  "realestate",
  "property",
  "homes",
  "house",

  // Regions (commonly used)
  "eu",
  "asia",
  "lat",

  // Major ccTLDs (high-usage countries; common for consumers and businesses)
  "us",
  "uk",
  "ca",
  "au",
  "nz",
  "ie",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "nl",
  "be",
  "lu",
  "ch",
  "at",
  "se",
  "no",
  "dk",
  "fi",
  "is",
  "pl",
  "cz",
  "sk",
  "hu",
  "ro",
  "bg",
  "gr",
  "ru",
  "ua",
  "by",
  "cn",
  "jp",
  "kr",
  "tw",
  "hk",
  "sg",
  "in",
  "pk",
  "bd",
  "lk",
  "br",
  "ar",
  "cl",
  "co", // intentionally duplicated in many lists; Set dedupes
  "pe",
  "mx",
  "za",
  "ng",
  "ke",
  "gh",
  "tr",
  "il",
  "sa",
  "ae",
  "ir",
  "th",
  "vn",
  "my",
  "id",
  "ph"
]);
