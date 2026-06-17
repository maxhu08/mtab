export const setTimeMessage = (
  messageEl: HTMLParagraphElement,
  format: "12hr" | "24hr" = "12hr"
) => {
  const currentDate = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[currentDate.getDay()];
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const minutesPadded = `${minutes < 10 ? "0" : ""}${minutes}`;

  const timeString = (() => {
    if (format === "12hr") {
      const meridiem = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;

      return `${day} ${displayHours}:${minutesPadded} ${meridiem}`;
    }

    if (format === "24hr") return `${day} ${hours}:${minutesPadded}`;

    return "error: use 12hr or 24hr format";
  })();

  messageEl.textContent = timeString;
};