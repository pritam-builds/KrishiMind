// src/components/MarketCard.jsx
import React from 'react';
import { TrendingUp, ArrowUpRight, Store, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function MarketCard({
  market,
  showLink = true,
  className = ""
}) {
  const { t } = useI18n();
  const {
    crop = "Tomato",
    marketLocation = "Pune APMC Market Yard",
    currentPrice = 2850,
    previousPrice = 2620,
    priceChangePct = 8.8,
    unit = "₹ / quintal",
    trend = "Trending upward",
    arrivalsToday = "1,450 Quintals"
  } = market || {};

  return (
    <div className={`bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm ${className}`}>
      <div className="flex items-start justify-between pb-4 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            {t("APMC Mandi Intelligence")}
          </span>
          <h3 className="text-lg font-bold text-stone-900 mt-1">{crop} {t("Rate")}</h3>
          <p className="text-xs text-stone-500">{marketLocation}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-stone-900">
            ₹{currentPrice.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500">{t(unit)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-4">
        <div className="p-3 bg-stone-50 rounded-xl">
          <div className="text-xs text-stone-500">{t("Price Trend")}</div>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">+{priceChangePct}%</span>
            <span className="text-[11px] text-stone-400 ml-1">{t("vs prev")}</span>
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl">
          <div className="text-xs text-stone-500">{t("Today's Arrivals")}</div>
          <div className="text-sm font-bold text-stone-800 mt-1">{arrivalsToday}</div>
        </div>
      </div>

      {showLink && (
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {t(trend)}
          </span>
          <Link
            to="/market"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            {t("Price Trends & Mandis →")}
          </Link>
        </div>
      )}
    </div>
  );
}
