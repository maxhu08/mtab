export const setMessage = (message: string) => {
  const messageEl = document.getElementById("message")!;
  messageEl.textContent = message;
};
