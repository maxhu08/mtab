import { MessageType } from "../config";
import { messageEl } from "../ui";

export const setMessage = (
  enabled: boolean,
  type: MessageType,
  customText: string,
  username: string
) => {
  if (!enabled) {
    messageEl.classList.add("hidden");
  }

  switch (type) {
    case "custom": {
      setCustomMessage(customText);
      setInterval(() => {
        setCustomMessage(customText);
      }, 1000);
      break;
    }
    case "date": {
      setDateMessage();
      break;
    }
    case "afternoon-morning": {
      setMorningAfternoonMessage(username);
      break;
    }
    case "time-12": {
      setTimeMessage("12hr");
      setInterval(() => {
        setTimeMessage("12hr");
      }, 1000);
      break;
    }
    case "time-24": {
      setTimeMessage("24hr");
      setInterval(() => {
        setTimeMessage("24hr");
      }, 1000);
      break;
    }
  }
};

export const setCustomMessage = (customText: string) => {
  const date = new Date();

  const meridianLower = date.getHours() >= 12 ? "pm" : "am";
  const meridianUpper = meridianLower.toUpperCase();

  customText = customText
    .replace(/\\hh/g, date.getHours().toString().padStart(2, "0"))
    .replace(/\\mm/g, date.getMinutes().toString().padStart(2, "0"))
    .replace(/\\ss/g, date.getSeconds().toString().padStart(2, "0"))
    .replace(/\\md/g, meridianLower)
    .replace(/\\MD/g, meridianUpper);

  messageEl.textContent = customText;
};

export const setMorningAfternoonMessage = (name: string) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  messageEl.textContent = `${greeting}, ${name}`;
};

export const setTimeMessage = (format: "12hr" | "24hr" = "12hr") => {
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

export const setDateMessage = () => {
  const date = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];

  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  messageEl.textContent = formattedDate;
};
