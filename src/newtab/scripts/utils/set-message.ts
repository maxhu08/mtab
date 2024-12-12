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

      if (containsSlashReplacements(customText)) {
        setInterval(() => {
          setCustomMessage(customText);
        }, 1000);
      }

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
    case "weather": {
      setWeatherMessage();
      break;
    }
  }
};

const setMorningAfternoonMessage = (name: string) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  messageEl.textContent = `${greeting}, ${name}`;
};

const setDateMessage = () => {
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

const setTimeMessage = (format: "12hr" | "24hr" = "12hr") => {
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

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: {
    time: string;
    interval: string;
    temperature: string;
    windspeed: string;
    winddirection: string;
    is_day: string;
    weathercode: string;
  };
  current_weather: {
    time: string;
    interval: number;
    temperature: number;
    windspeed: number;
    winddirection: number;
    is_day: number;
    weathercode: number;
  };
}

const setWeatherMessage = () => {
  messageEl.textContent = "...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // prettier-ignore
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

        if (!response.ok) throw new Error();

        const data = (await response.json()) as OpenMeteoResponse;

        messageEl.textContent = getWeatherMessage(data);
      } catch (err) {
        messageEl.textContent = "Failed to fetch weather data";
        console.error(`SET_WEATHER_MESSAGE: ${err}`);
      }
    },
    (err) => {
      messageEl.textContent = "Location Access Denied";
      console.error(`SET_WEATHER_MESSAGE: ${err}`);
    }
  );
};

const getWeatherMessage = (data: OpenMeteoResponse) => {
  return `${getWeatherEmoji(data.current_weather.weathercode)} ${getWeatherDescription(data.current_weather.weathercode)} ${data.current_weather.temperature.toString()} ${data.current_weather_units.temperature}`;
};

const getWeatherEmoji = (weatherCode: number): string => {
  if (weatherCode === 0)
    return "☀️"; // clear sky
  else if (weatherCode === 1 || weatherCode === 2)
    return "🌤️"; // mainly clear
  else if (weatherCode === 3)
    return "☁️"; // overcast
  else if (weatherCode === 45 || weatherCode === 48)
    return "🌫️"; // fog
  else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55)
    return "🌦️"; // drizzle
  else if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65)
    return "🌧️"; // rain
  else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75)
    return "❄️"; // snowfall
  else if (weatherCode === 95)
    return "⛈️"; // thunderstorm
  else if (weatherCode === 96 || weatherCode === 99)
    return "🌩️"; // thunderstorm with hail
  else return "🌈"; // default
};

const getWeatherDescription = (weatherCode: number): string => {
  if (weatherCode === 0) return "Clear sky";
  else if (weatherCode === 1 || weatherCode === 2) return "Mainly clear";
  else if (weatherCode === 3) return "Overcast";
  else if (weatherCode === 45 || weatherCode === 48) return "Fog";
  else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55) return "Light drizzle";
  else if (weatherCode === 56 || weatherCode === 57) return "Freezing drizzle";
  else if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65) return "Light rain";
  else if (weatherCode === 66 || weatherCode === 67) return "Freezing rain";
  else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75) return "Light snow";
  else if (weatherCode === 77 || weatherCode === 79) return "Snow grains";
  else if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82)
    return "Heavy rain showers";
  else if (weatherCode === 85 || weatherCode === 86) return "Heavy snow showers";
  else if (weatherCode === 95) return "Thunderstorms";
  else if (weatherCode === 96 || weatherCode === 99) return "Thunderstorm with hail";
  else return "Unknown weather";
};

const setCustomMessage = (customText: string) => {
  const date = new Date();

  const hours12 = date.getHours() % 12 || 12;
  const meridianLower = date.getHours() >= 12 ? "pm" : "am";
  const meridianUpper = meridianLower.toUpperCase();

  const dayOfMonth = date.getDate().toString().padStart(2, "0");
  const monthOfYear = (date.getMonth() + 1).toString().padStart(2, "0");

  customText = customText;
  customText = customText
    .replace(/\\yyyy/g, date.getFullYear().toString()) // must come before \yy
    .replace(/\\yy/g, date.getFullYear().toString().slice(-2))
    .replace(/\\MD/g, meridianUpper) // must come before \M
    .replace(/\\M/g, date.toLocaleString("default", { month: "long" }))
    .replace(/\\m\$/g, monthOfYear) // must come before \m
    .replace(/\\mm/g, date.getMinutes().toString().padStart(2, "0")) // must come before \m\
    .replace(/\\md/g, meridianLower) // must come before \m
    .replace(/\\m/g, date.toLocaleString("default", { month: "short" }))
    .replace(/\\D/g, date.toLocaleString("default", { weekday: "long" }))
    .replace(/\\d\$/g, dayOfMonth) // must come before \d
    .replace(/\\d/g, date.toLocaleString("default", { weekday: "short" }))
    .replace(/\\h%/g, hours12.toString().padStart(2, "0"))
    .replace(/\\hh/g, date.getHours().toString().padStart(2, "0"))
    .replace(/\\ss/g, date.getSeconds().toString().padStart(2, "0"));

  messageEl.textContent = customText;
};

const containsSlashReplacements = (text: string) => {
  const checkChars = [
    "\\yyyy",
    "\\yy",
    "\\M",
    "\\m",
    "\\m$",
    "\\D",
    "\\d",
    "\\d$",
    "\\h%",
    "\\hh",
    "\\mm",
    "\\ss",
    "\\md",
    "\\MD"
  ];

  return checkChars.some((char) => text.includes(char));
};
