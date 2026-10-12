// src/components/LoadingScreen.jsx
import React from 'react';
import { Sprout, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';

export default function LoadingScreen({ message = "Calculating Crop Risk Indicator..." }) {
  const { t } = useI18n();
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-700 animate-pulse">
          <Sprout className="w-10 h-10" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">
        {t(message)}
      </h3>
      <p className="text-xs text-stone-500 max-w-md leading-relaxed">
        {t("Applying transparent rules to the crop details, selected symptoms, and field observations you provided...")}
      </p>

      {/* Progress simulation badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-stone-600 font-medium">
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100 flex items-center gap-1.5">
          <Sprout className="w-3.5 h-3.5" /> {t("Farmer-Reported Inputs")}
        </span>
        <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 flex items-center gap-1.5">
          {t("Rule-Based Assessment")}
        </span>
      </div>
    </div>
  );
}
