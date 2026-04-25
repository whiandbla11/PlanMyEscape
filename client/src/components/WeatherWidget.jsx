import { Droplets, Wind, Thermometer } from 'lucide-react';

export default function WeatherWidget({ weather }) {
  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
      <p className="text-sm font-medium text-sky-100 mb-1">Current Weather</p>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-bold">{weather.temp}°</span>
            <span className="text-xl mb-1">C</span>
          </div>
          <p className="capitalize text-sky-100 text-sm mt-1">{weather.description}</p>
        </div>
        <img src={iconUrl} alt={weather.description} className="w-20 h-20" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-4 h-4 text-sky-200" />
          <div>
            <p className="text-xs text-sky-200">Feels like</p>
            <p className="text-sm font-semibold">{weather.feelsLike}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-4 h-4 text-sky-200" />
          <div>
            <p className="text-xs text-sky-200">Humidity</p>
            <p className="text-sm font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-4 h-4 text-sky-200" />
          <div>
            <p className="text-xs text-sky-200">Wind</p>
            <p className="text-sm font-semibold">{weather.windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
