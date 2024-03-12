export function modifyNestedObject<T>(obj: T, modifier: (draft: T) => void): T {
  const draft = { ...obj };
  modifier(draft);

  return draft;
}
