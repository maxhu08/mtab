import { MessageType } from "../config";
import { messageEl } from "../ui";

export const setMessage = (type: MessageType, customText: string, username: string) => {
  switch (type) {
    case "custom": {
      messageEl.textContent = customText;
    }
    case "date": {
      messageEl.textContent = "date wip"
      break;
    }
    case "afternoon-morning": {
      setMorningAfternoonMessage(username)
      break;
    }
    case "time-12": {
      setTimeMessage("12hr");
      break;
    }
    case "time-24": {
      setTimeMessage("24hr");
      break;
    }
  }
};

export const setMorningAfternoonMessage = (name: string) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour < 12) greeting = "Good morning";
  else greeting = "Good afternoon";

  messageEl.textContent = `${greeting}, ${name}`;
};

export const setTimeMessage = (format: "12hr" | "24hr" = "12hr") => {
  const currentDate = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[currentDate.getDay()];
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes()

  let timeString;
  if (format === "12hr") {
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    timeString = `${day} ${hours}:${minutes < 10 && "0" + minutes} ${meridiem}`;
  } else if (format === "24hr") {
    timeString = `${day} ${hours}:${minutes < 10 && "0" + minutes}`;
  } else {
    timeString = "error: use 12hr or 24hr format";
  }

  messageEl.textContent = timeString;
};
