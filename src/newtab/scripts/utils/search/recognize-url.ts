export const recognizeUrl = (input: string): string | null => {
  const s = input.trim();
  if (!s || /\s/.test(s)) return null;

  const normalizeAbsoluteHttp = (raw: string): string | null => {
    const u =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (URL as any).parse === "function"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (URL as any).parse(raw)
        : (() => {
            try {
              return new URL(raw);
            } catch {
              return null;
            }
          })();

    if (!u) return null;
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  };

  const abs = normalizeAbsoluteHttp(s);
  if (abs) return abs;

  const m = s.match(/^([^/?#]+)(.*)$/);
  if (!m) return null;

  const host = m[1].toLowerCase();
  const rest = m[2] ?? "";

  const labels = host.split(".");
  if (labels.length < 2) return null;

  for (const label of labels) {
    if (
      label.length < 1 ||
      label.length > 63 ||
      !/^[a-z0-9-]+$/.test(label) ||
      label.startsWith("-") ||
      label.endsWith("-")
    ) {
      return null;
    }
  }

  const tld = labels[labels.length - 1];
  if (!POPULAR_TLDS.has(tld)) return null;

  const candidate = `https://${host}${rest}`;
  return normalizeAbsoluteHttp(candidate);
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
