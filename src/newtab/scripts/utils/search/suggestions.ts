export const fetchSearchSuggestions = (q: string) => {
  return new Promise<string[]>((resolve) => {
    chrome.runtime.sendMessage({ type: "suggestions:duckduckgo", q }, (resp) => {
      const suggestions = resp?.ok && Array.isArray(resp.suggestions) ? resp.suggestions : [];
      resolve(suggestions);
    });
  });
};
