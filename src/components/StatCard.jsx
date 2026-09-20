// src/components/StatCard.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  badgeText,
  badgeColor = "bg-emerald-100 text-emerald-800",
  trendText,
  trendType = "neutral",
  onClick,
  className = ""
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-300' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{title}</p>
            <h3 className="text-xl font-bold text-stone-800 mt-0.5">{value}</h3>
          </div>
        </div>

        {badgeText && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>

      {(subValue || trendText) && (
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          {subValue && <span>{subValue}</span>}
          {trendText && (
            <div className="flex items-center gap-1 font-medium ml-auto">
              {trendType === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
              {trendType === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />}
              {trendType === 'neutral' && <Minus className="w-3.5 h-3.5 text-stone-400" />}
              <span
                className={
                  trendType === 'up'
                    ? 'text-emerald-700'
                    : trendType === 'down'
                    ? 'text-rose-700'
                    : 'text-stone-600'
                }
              >
                {trendText}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
