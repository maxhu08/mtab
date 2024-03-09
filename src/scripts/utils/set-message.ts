import { messageEl } from "src/scripts/ui";

export const setCustomMessage = (message: string) => {
  messageEl.textContent = message;
};

export const setMorningAfternoonMessage = (name: string) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour < 12) greeting = "Good morning";
  else greeting = "Good afternoon";

  messageEl.textContent = `${greeting}, ${name}`;
};
