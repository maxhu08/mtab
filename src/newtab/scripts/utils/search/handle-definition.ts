import { AssistDefinition } from "~/src/newtab/scripts/utils/search/search-assist-utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefinitionData = any;

const definitionCache = new Map<string, DefinitionData | null>();
const inFlight = new Map<string, Promise<DefinitionData | null>>();

const getDefinition = async (word: string) => {
  const cached = definitionCache.get(word);
  if (cached !== undefined) return cached;

  const existing = inFlight.get(word);
  if (existing) return existing;

  const p = (async () => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/open-dictionary/english-dictionary/master/${word[0]}/${word[1]}/${word}/en.json`
      );

      if (!response.ok) {
        definitionCache.set(word, null);
        return null;
      }

      const data = (await response.json()) as DefinitionData;
      definitionCache.set(word, data);
      return data;
    } catch {
      definitionCache.set(word, null);
      return null;
    } finally {
      inFlight.delete(word);
    }
  })();

  inFlight.set(word, p);
  return p;
};

export const handleDefinition = async (val: string) => {
  const match = val.match(/\b(.+?)\s+def(?:i(?:n(?:i(?:t(?:i(?:o(?:n)?)?)?)?)?)?)?$/i);
  if (!match) return;

  const word = match[1].toLowerCase().trim();
  if (!word || word.length < 2) return;

  const data = await getDefinition(word);
  if (!data) return;

  return { type: "definition", result: data } satisfies AssistDefinition;
};
