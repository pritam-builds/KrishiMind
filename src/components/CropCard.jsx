// src/components/CropCard.jsx
import React from 'react';
import { Sprout, MapPin, Calendar, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CropCard({
  crop = "Tomato",
  variety = "Abhinav (F1)",
  stage = "Fruiting",
  location = "Pune, Maharashtra",
  date = "19 Sep 2026",
  riskScore = 72,
  riskBand = "Moderate–High Risk",
  showAction = true,
  actionText = "View Detailed Assessment",
  actionLink = "/crop-analysis"
}) {
  const getRiskBadge = (score) => {
    if (score >= 68) {
      return {
        bg: "bg-red-50 text-red-700 border-red-200",
        label: "Moderate–High Risk",
        dot: "bg-red-500"
      };
    } else if (score >= 45) {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Moderate Risk",
        dot: "bg-amber-500"
      };
    }
    return {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Low Risk",
      dot: "bg-emerald-500"
    };
  };

  const badge = getRiskBadge(riskScore);

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-stone-900">{crop}</h3>
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                {variety}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">Growth Stage: <span className="font-semibold text-stone-700">{stage}</span></p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
          <span>{riskBand || badge.label}</span>
          <span className="opacity-75">({riskScore}/100)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-stone-400" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400" />
          <span>Assessed: {date}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Decision Support Active</span>
        </div>
      </div>

      {showAction && (
        <div className="pt-2">
          <Link
            to={actionLink}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm shadow-emerald-700/20"
          >
            {actionText}
          </Link>
        </div>
      )}
    </div>
  );
}
