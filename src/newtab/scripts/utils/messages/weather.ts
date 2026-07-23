import { logger } from "~/src/utils/logger";
import { t } from "~/src/i18n";

type OpenMeteoResponse = {
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
};

export const setWeatherMessage = (messageEl: HTMLParagraphElement, unitsType: "f" | "c") => {
  messageEl.textContent = "...";

  const cachedData = localStorage.getItem("weatherData");
  const cachedTimestamp = localStorage.getItem("weatherTimestamp");
  const currentTime = new Date().getTime();

  // if cached data is recent enough (5 mins)
  if (cachedData && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 5 * 60 * 1000) {
    const data = JSON.parse(cachedData);
    messageEl.textContent = getWeatherMessage(data, unitsType);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current_weather=true`
        );

        if (!response.ok) throw new Error();

        const data = await response.json();
        localStorage.setItem("weatherData", JSON.stringify(data)); // cache raw data
        localStorage.setItem("weatherTimestamp", currentTime.toString()); // cache timestamp

        messageEl.textContent = getWeatherMessage(data, unitsType);
      } catch (err) {
        messageEl.textContent = t("Failed to fetch weather data");
        logger.log(`SET_WEATHER_MESSAGE: ${err}`);
      }
    },
    (err) => {
      messageEl.textContent = t("Location Access Denied");
      logger.log(`SET_WEATHER_MESSAGE: ${err}`);
    }
  );
};

const getWeatherMessage = (data: OpenMeteoResponse, unitsType: "f" | "c"): string => {
  const temperature =
    unitsType === "f"
      ? (data.current_weather.temperature * 9) / 5 + 32
      : data.current_weather.temperature;
  const unitSymbol = unitsType === "f" ? "°F" : "°C";
  const weatherCode = data.current_weather.weathercode;
  const emoji = getWeatherEmoji(weatherCode);
  const description = getWeatherDescription(weatherCode);

  return `${emoji} ${description} ${Math.round(temperature)} ${unitSymbol}`;
};

const getWeatherEmoji = (weatherCode: number): string => {
  if (weatherCode === 0)
    return "☀️"; // clear sky
  else if (weatherCode === 1 || weatherCode === 2)
    return "🌤️"; // mainly clear
  else if (weatherCode === 3)
    return "☁️"; // overcast
  else if (weatherCode === 45 || weatherCode === 48)
    return "☁️"; // fog
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
  else return "☁️"; // default
};

const getWeatherDescription = (weatherCode: number): string => {
  if (weatherCode === 0) return t("Clear sky");
  else if (weatherCode === 1 || weatherCode === 2) return t("Mainly clear");
  else if (weatherCode === 3) return t("Overcast");
  else if (weatherCode === 45 || weatherCode === 48) return t("Fog");
  else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55)
    return t("Light drizzle");
  else if (weatherCode === 56 || weatherCode === 57) return t("Freezing drizzle");
  else if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65) return t("Light rain");
  else if (weatherCode === 66 || weatherCode === 67) return t("Freezing rain");
  else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75) return t("Light snow");
  else if (weatherCode === 77 || weatherCode === 79) return t("Snow grains");
  else if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82)
    return t("Heavy rain showers");
  else if (weatherCode === 85 || weatherCode === 86) return t("Heavy snow showers");
  else if (weatherCode === 95) return t("Thunderstorms");
  else if (weatherCode === 96 || weatherCode === 99) return t("Thunderstorm with hail");
  else return t("Unknown");
};