// src/pages/Weather.jsx
import React from 'react';
import { useCrop } from '../context/CropContext';
import { useI18n } from '../i18n';
import ChartCard from '../components/ChartCard';
import {
  CloudSun,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  MapPin,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function Weather() {
  const { weather, weatherError } = useCrop();
  const { t, formatDate } = useI18n();

  const forecastData = weather?.forecast || [];
  const weatherRisk = weather?.agriculturalWeatherRisk;
  const riskCards = [
    {
      title: t("Rainfall Risk"),
      icon: CloudRain,
      iconClass: "bg-amber-50 text-amber-700",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
      risk: weatherRisk?.rainfall,
      footer: `${t("Forecast rainfall:")} ${forecastData[0]?.rainMm ?? "—"} ${t("mm today")}`
    },
    {
      title: t("Humidity Risk"),
      icon: Droplets,
      iconClass: "bg-red-50 text-red-700",
      badgeClass: "bg-red-100 text-red-800 border-red-300",
      risk: weatherRisk?.humidity,
      footer: t("Based on relative humidity")
    },
    {
      title: t("Temperature Stress"),
      icon: Sun,
      iconClass: "bg-emerald-50 text-emerald-700",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      risk: weatherRisk?.temperature,
      footer: t("Based on current temperature")
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold mb-2">
              <CloudSun className="w-3.5 h-3.5 text-blue-600" />
              <span>{t("Agro-Meteorological Forecast")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t("Weather Intelligence")}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t("Current Location:")} <strong className="text-stone-800">{weather?.location || t("Loading location...")}</strong></span>
            </p>
            {weather?.isSample && (
              <p className="text-[11px] font-semibold text-amber-700 mt-1">
                {t("Sample fallback data — not live weather · Source:")} {weather.dataSource}
                {weather.timestamp && ` · ${t("Updated")} ${formatDate(new Date(weather.timestamp), { dateStyle: 'medium', timeStyle: 'short' })}`}
              </p>
            )}
            {weatherError && (
              <p className="text-[11px] text-red-700 mt-1">{t(weatherError)}</p>
            )}
          </div>

          {/* Current weather big readout */}
          <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 self-start sm:self-auto">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <CloudSun className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-stone-900">
                {weather?.currentTemp ?? "—"}°C
              </div>
              <p className="text-xs text-stone-500">
                {t(weather?.condition || "Weather data unavailable")}
              </p>
            </div>
          </div>
        </div>

        {/* Current Core Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>{t("Humidity")}</span>
            </div>
            <div className="text-lg font-extrabold text-stone-900 mt-1">
              {weather?.humidity ?? "—"}%
            </div>
            <p className="text-[11px] text-stone-400">{t("High foliage moisture")}</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t("Rain Probability")}</span>
            </div>
            <div className="text-lg font-extrabold text-stone-900 mt-1">
              {weather?.rainProbability ?? "—"}%
            </div>
            <p className="text-[11px] text-stone-400">{weather?.rainfallMm ?? "—"} {t("mm forecast")}</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <span>{t("Wind Speed")}</span>
            </div>
            <div className="text-lg font-extrabold text-stone-900 mt-1">
              {weather?.windSpeed || "—"}
            </div>
            <p className="text-[11px] text-stone-400">{t("Moderate breeze")}</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>{t("Night Temp")}</span>
            </div>
            <div className="text-lg font-extrabold text-stone-900 mt-1">
              {forecastData[0]?.minTemp ?? "—"}°C
            </div>
            <p className="text-[11px] text-stone-400">{t("Forecast overnight minimum")}</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Chart */}
      <ChartCard
        title={t("5-Day Temperature & Rain Probability Forecast")}
        subtitle={t("Tracking daily maximum daytime temperature against rain probability percentage")}
        badgeText={weather?.location ? `${weather.location} ${t("Forecast")}` : t("Local Forecast")}
        badgeColor="bg-blue-50 text-blue-700 border border-blue-200"
      >
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={t} />
              <YAxis yAxisId="left" domain={[15, 35]} tick={{ fontSize: 12, fill: '#64748b' }} unit="°C" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(val, name) => [name === 'Rain Probability' ? `${val}%` : `${val}°C`, t(name)]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name={t("Max Temp (°C)")}
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4, fill: '#16a34a' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rainProb"
                name={t("Rain Probability (%)")}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Crop Weather Risk Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-stone-900">
            {t("Crop Weather Risk")}
          </h2>
          <p className="text-xs text-stone-500">
            {weatherRisk?.overall
              ? `${t("Overall agricultural weather risk:")} ${t(weatherRisk.overall)}`
              : t("Evaluating how current meteorological conditions impact foliar health and crop stress")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskCards.map(({ title, icon: Icon, iconClass, badgeClass, risk, footer }) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl ${iconClass} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">{title}</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badgeClass}`}>
                    {t(risk?.level || "—")}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t(risk?.explanation || "Weather risk information is unavailable.")}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                {footer}
              </div>
            </div>
          ))}
        </div>

        {/* Required Agricultural Explanation Banner */}
        <div className="mt-4 p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{t("Agricultural Explanation:")}</strong> {t(weather?.riskExplanation || "Weather-based agricultural guidance is unavailable.")}
          </p>
        </div>
      </div>
    </div>
  );
}
