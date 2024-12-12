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

export const setWeatherMessage = (messageEl: HTMLParagraphElement) => {
  messageEl.textContent = "...";

  const cachedData = localStorage.getItem("weatherData");
  const cachedTimestamp = localStorage.getItem("weatherTimestamp");
  const currentTime = new Date().getTime();

  // if cached message is recent enough (5 mins)
  if (cachedData && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 5 * 60 * 1000) {
    messageEl.textContent = JSON.parse(cachedData).message;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        if (!response.ok) throw new Error();

        const data = await response.json();
        const message = getWeatherMessage(data);

        messageEl.textContent = message;
        localStorage.setItem("weatherData", JSON.stringify({ message }));
        localStorage.setItem("weatherTimestamp", currentTime.toString());
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
  else return "Unknown";
};
