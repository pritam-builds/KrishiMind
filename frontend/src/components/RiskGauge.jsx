// src/components/RiskGauge.jsx
import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n';

export default function RiskGauge({
  score = 72,
  label = "Moderate–High Risk",
  title = "Crop Health Risk",
  disclaimer = "An uncertain rule-based indicator from reported inputs, not a guaranteed diagnosis. Uploaded images are not analyzed."
}) {
  const { t } = useI18n();
  // Clamped score between 0 and 100
  const clampedScore = Math.min(Math.max(Number(score) || 0, 0), 100);

  // Determine color and status
  const getColor = (val) => {
    if (val >= 65) return { stroke: '#dc2626', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
    if (val >= 35) return { stroke: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' };
    return { stroke: '#16a34a', bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
  };

  const theme = getColor(clampedScore);

  // SVG Gauge calculations
  // Semi-circle radius: 70, center: (100, 95)
  // Arc length for semicircle: PI * R = 3.14159 * 70 ≈ 220
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col items-center text-center">
      <div className="w-full flex items-center justify-between pb-3 mb-1 border-b border-stone-100 text-left">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-stone-900">{title}</h3>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${theme.badge}`}>
          {t(label)}
        </span>
      </div>

      {/* SVG Semicircle Gauge */}
      <div className="relative w-56 h-32 mt-4 flex items-center justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 115">
          {/* Background track */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Colored progress arc */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke={theme.stroke}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
            {clampedScore}<span className="text-2xl font-bold text-stone-500">%</span>
          </span>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {t("Risk Indicator")}
          </span>
        </div>
      </div>

      {/* Risk levels legend */}
      <div className="w-full grid grid-cols-3 gap-2 mt-4 text-[11px] font-medium border-t border-stone-100 pt-3 text-stone-600">
        <div className="flex items-center justify-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>{t("Low (0-34)")}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>{t("Mod (35-64)")}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>{t("High (65-100)")}</span>
        </div>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-stone-600 text-xs flex items-start gap-2 text-left">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t(disclaimer)}</p>
        </div>
      )}
    </div>
  );
}
