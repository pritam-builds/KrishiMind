// src/components/RiskCard.jsx
import React from 'react';
import { AlertTriangle, Droplets, CloudRain, Sprout, ShieldAlert } from 'lucide-react';

export default function RiskCard({
  title,
  metric,
  status,
  badgeColor,
  description,
  icon
}) {
  const getIcon = () => {
    if (title.toLowerCase().includes('humidity')) return Droplets;
    if (title.toLowerCase().includes('rain')) return CloudRain;
    if (title.toLowerCase().includes('stage') || title.toLowerCase().includes('crop')) return Sprout;
    if (title.toLowerCase().includes('spot') || title.toLowerCase().includes('symptom')) return AlertTriangle;
    return ShieldAlert;
  };

  const IconComponent = icon || getIcon();

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">{title}</h4>
              {metric && <p className="text-xs text-stone-500 font-medium">{metric}</p>}
            </div>
          </div>
          {status && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badgeColor || 'bg-stone-100 text-stone-700 border-stone-200'}`}>
              {status}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
