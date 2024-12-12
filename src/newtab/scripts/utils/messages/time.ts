export const setTimeMessage = (
  messageEl: HTMLParagraphElement,
  format: "12hr" | "24hr" = "12hr"
) => {
  const currentDate = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[currentDate.getDay()];
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  let timeString;
  if (format === "12hr") {
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    timeString = `${day} ${hours}:${(minutes < 10 ? "0" : "") + minutes} ${meridiem}`;
  } else if (format === "24hr") {
    timeString = `${day} ${hours}:${(minutes < 10 ? "0" : "") + minutes}`;
  } else {
    timeString = "error: use 12hr or 24hr format";
  }

  messageEl.textContent = timeString;
};
