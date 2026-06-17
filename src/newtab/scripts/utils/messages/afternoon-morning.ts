export const setMorningAfternoonMessage = (messageEl: HTMLParagraphElement, name: string) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  messageEl.textContent = `${greeting}, ${name}`;
};