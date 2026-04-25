import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function getWeather(city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
        },
      }
    );

    const data = response.data;
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      cityName: data.name,
      country: data.sys.country,
    };
  } catch {
    return null;
  }
}
