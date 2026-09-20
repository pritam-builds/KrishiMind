// src/components/WeatherCard.jsx
import React from 'react';
import { CloudRain, Droplets, Wind, Sun, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeatherCard({
  weather,
  showLink = true,
  className = ""
}) {
  const {
    location = "Pune, Maharashtra",
    currentTemp = 28,
    tempUnit = "°C",
    condition = "Partly Cloudy with Humidity",
    humidity = 78,
    rainProbability = 65,
    windSpeed = "14 km/h"
  } = weather || {};

  return (
    <div className={`bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm ${className}`}>
      <div className="flex items-start justify-between pb-4 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Field Microclimate
          </span>
          <h3 className="text-lg font-bold text-stone-900 mt-1">{location}</h3>
          <p className="text-xs text-stone-500">{condition}</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-extrabold text-stone-900">
            {currentTemp}{tempUnit}
          </div>
          <p className="text-xs text-stone-500 font-medium">Current Temp</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-4 text-center">
        <div className="p-2.5 bg-stone-50 rounded-xl">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-stone-800">{humidity}%</div>
          <div className="text-[11px] text-stone-500">Humidity</div>
        </div>

        <div className="p-2.5 bg-stone-50 rounded-xl">
          <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
            <CloudRain className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-stone-800">{rainProbability}%</div>
          <div className="text-[11px] text-stone-500">Rain Prob.</div>
        </div>

        <div className="p-2.5 bg-stone-50 rounded-xl">
          <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
            <Wind className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-stone-800">{windSpeed}</div>
          <div className="text-[11px] text-stone-500">Wind</div>
        </div>
      </div>

      {showLink && (
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
            ● High humidity risk for fungal spots
          </span>
          <Link
            to="/weather"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            5-Day Forecast →
          </Link>
        </div>
      )}
    </div>
  );
}
