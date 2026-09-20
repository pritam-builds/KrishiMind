// src/components/ProgressBar.jsx
import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = "",
  showPercentage = true,
  color = "emerald",
  size = "md"
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colorMap = {
    emerald: "bg-emerald-600",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-600"
  };

  const heightMap = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-stone-600 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-stone-100 rounded-full overflow-hidden ${heightMap[size] || 'h-2.5'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color] || 'bg-emerald-600'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
