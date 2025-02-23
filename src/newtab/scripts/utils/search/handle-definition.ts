export const handleDefinition = async (val: string) => {
  const match = val.match(/\b(.+?)\s+def(?:i(?:n(?:i(?:t(?:i(?:o(?:n)?)?)?)?)?)?)?$/);
  if (!match) return;

  const word = match[1];

  try {
    // prettier-ignore
    const response = await fetch(`https://raw.githubusercontent.com/open-dictionary/english-dictionary/master/${word[0]}/${word[1]}/${word}/en.json`);
    // const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    const data = await response.json();
    return { type: "definition", result: data } as const;
  } catch {}
};
