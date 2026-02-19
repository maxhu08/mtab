export const fetchSearchSuggestions = (q: string) => {
  return new Promise<string[]>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "s", q }, (resp) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        const error = `Failed to fetch search suggestions: ${runtimeError.message}`;
        console.error(error, { q });
        reject(new Error(error));
        return;
      }

      if (!resp?.ok) {
        const error = `Search suggestions backend returned an error: ${resp?.error ?? "unknown error"}`;
        console.error(error, { q, resp });
        reject(new Error(error));
        return;
      }

      const suggestions = resp?.ok && Array.isArray(resp.suggestions) ? resp.suggestions : [];
      resolve(suggestions);
    });
  });
};
