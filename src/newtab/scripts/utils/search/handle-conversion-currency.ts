import { CURRENCY_ALIASES } from "src/newtab/scripts/utils/search/currency-aliases";

type ConversionCurrencyResult = {
  type: "conversion-currency";
  before: string;
  after: string;
  timestamp: number; // ms since epoch (when the rate was updated / known)
};

const DEFAULT_TO = "USD";

const normalizeInput = (s: string) => s.trim().replace(/\s+/g, " ");

const normalizeAliasKey = (s: string) => {
  const compact = s.replace(/\s+/g, "");
  return /[a-zA-Z]/.test(compact) ? compact.toLowerCase() : compact;
};

const buildAliasMap = () => {
  const map = new Map<string, { code: string; alias: string }>();
  for (const [code, aliases] of Object.entries(CURRENCY_ALIASES)) {
    for (const alias of aliases) {
      map.set(normalizeAliasKey(alias), { code, alias });
    }
  }
  return map;
};

const ALIAS_MAP = buildAliasMap();

// only accept 3-letter ISO codes if they are supported
const SUPPORTED_ISO_CODES = new Set(Object.keys(CURRENCY_ALIASES).map((c) => c.toUpperCase()));

const resolveCurrencyCode = (token: string): string | undefined => {
  const t = token.trim();
  if (!t) return undefined;

  // prefer alias map (yen -> JPY, dollar -> USD, etc.)
  const hit = ALIAS_MAP.get(normalizeAliasKey(t));
  if (hit) return hit.code.toUpperCase();

  // then allow ISO code input, but only if supported
  if (/^[a-z]{3}$/i.test(t)) {
    const code = t.toUpperCase();
    if (SUPPORTED_ISO_CODES.has(code)) return code;
  }

  return undefined;
};

const parseAmountAndCurrency = (s: string): { amount: number; curToken: string } | undefined => {
  const t = s.trim();
  if (!t) return undefined;

  // "12$" / "12usd"
  let m = t.match(/^(\d+(?:\.\d+)?)([^\d\s]+)$/i);
  if (m) return { amount: Number(m[1]), curToken: m[2] };

  // "12 usd" OR "usd" OR "$"
  m = t.match(/^(\d+(?:\.\d+)?)?\s*([^\d\s]+)$/i);
  if (!m) return undefined;

  return {
    amount: m[1] ? Number(m[1]) : 1,
    curToken: m[2]
  };
};

const fmtAmount = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(10).replace(/\.?0+$/, "");
};

const parseHexaTimestampMs = (ts?: string): number | undefined => {
  if (!ts) return undefined;
  const ms = Date.parse(ts);
  return Number.isFinite(ms) ? ms : undefined;
};

const getHexaRateLatest = async (
  from: string,
  to: string
): Promise<{ mid: number; timestampMs?: number }> => {
  const url = `https://hexarate.paikama.co/api/rates/${encodeURIComponent(
    from
  )}/${encodeURIComponent(to)}/latest`;

  const res = await fetch(url);
  const json = (await res.json().catch(() => ({}))) as {
    status_code?: number;
    data?: { mid?: number; message?: string; timestamp?: string };
  };

  if (!res.ok || json.status_code === 422) {
    throw new Error(json.data?.message || `HexaRate HTTP ${res.status}`);
  }

  const mid = json.data?.mid;
  if (typeof mid !== "number" || !Number.isFinite(mid) || mid <= 0) {
    throw new Error("HexaRate: invalid mid");
  }

  return { mid, timestampMs: parseHexaTimestampMs(json.data?.timestamp) };
};

export const handleConversionCurrency = async (
  val: string
): Promise<ConversionCurrencyResult | undefined> => {
  const input = normalizeInput(val);
  if (!input) return undefined;

  const parts = input.split(/\b(?:into|to|in)\b/i).map((p) => p.trim());
  if (parts.length > 2) return undefined;

  const left = parts[0];
  const right = parts.length === 2 ? parts[1] : "";

  const leftParsed = parseAmountAndCurrency(left);
  if (!leftParsed) return undefined;

  const fromCode = resolveCurrencyCode(leftParsed.curToken);
  if (!fromCode) return undefined;

  let toCode = DEFAULT_TO;
  if (right) {
    const rightToken = right.replace(/\s+/g, "");
    const resolved = resolveCurrencyCode(rightToken);
    if (!resolved) return undefined;
    toCode = resolved;
  }

  const amountStr = fmtAmount(leftParsed.amount);

  // If same currency, echo
  if (fromCode === toCode) {
    return {
      type: "conversion-currency",
      before: `${amountStr} ${fromCode}`,
      after: `${amountStr} ${toCode}`,
      timestamp: Date.now()
    } satisfies ConversionCurrencyResult;
  }

  // If exactly "1 USD" -> don't fetch; return 1 -> 1
  if (leftParsed.amount === 1 && fromCode === "USD") {
    return {
      type: "conversion-currency",
      before: `1 USD`,
      after: `1 ${toCode}`,
      timestamp: Date.now()
    } satisfies ConversionCurrencyResult;
  }

  try {
    const { mid, timestampMs } = await getHexaRateLatest(fromCode, toCode);
    const converted = leftParsed.amount * mid;

    return {
      type: "conversion-currency",
      before: `${amountStr} ${fromCode}`,
      after: `${fmtAmount(converted)} ${toCode}`,
      timestamp: timestampMs!
    } satisfies ConversionCurrencyResult;
  } catch {
    return undefined;
  }
};
