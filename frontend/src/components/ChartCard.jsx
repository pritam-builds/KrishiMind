// src/components/ChartCard.jsx
import React from 'react';
import { useI18n } from '../i18n';

export default function ChartCard({
  title,
  subtitle,
  badgeText,
  badgeColor = "bg-stone-100 text-stone-700",
  action,
  children,
  className = ""
}) {
  const { t } = useI18n();
  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-stone-900">{t(title)}</h3>
            {badgeText && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${badgeColor}`}>
                {t(badgeText)}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-stone-500 mt-0.5">{t(subtitle)}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
