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

  {
    const abs = normalizeAbsoluteHttp(s);
    if (abs) return abs;
  }

  const m = s.match(/^([^/?#]+)(.*)$/);
  if (!m) return null;

  const host = m[1];
  const rest = m[2] ?? "";

  const hostLooksPublic = /^(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i.test(
    host
  );

  if (!hostLooksPublic) return null;

  const candidate = `https://${host}${rest}`;
  return normalizeAbsoluteHttp(candidate);
};
