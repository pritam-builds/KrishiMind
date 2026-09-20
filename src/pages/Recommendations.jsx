// src/pages/Recommendations.jsx
import React, { useState } from 'react';
import { useCrop } from '../context/CropContext';
import RecommendationCard from '../components/RecommendationCard';
import {
  Lightbulb,
  Activity,
  CloudSun,
  TrendingUp,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Circle,
  AlertCircle,
  HelpCircle,
  Share2,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recommendations() {
  const { currentAnalysis, weather, market, recommendations } = useCrop();

  const factors = [
    {
      id: "crop_health",
      title: "1. Crop Health",
      status: currentAnalysis?.riskBand || "Moderate–High Risk",
      detail: "Visual observations show leaf spots with necrotic rings. Risk score estimated at " + (currentAnalysis?.riskScore || 72) + "/100.",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      borderColor: "border-amber-300",
      icon: Activity
    },
    {
      id: "weather",
      title: "2. Weather",
      status: "High Humidity (78%)",
      detail: `${weather?.humidity || 78}% humidity and ${weather?.rainProbability || 65}% rain probability over next 36h. Canopy wetness favors spore growth.`,
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      borderColor: "border-blue-300",
      icon: CloudSun
    },
    {
      id: "market",
      title: "3. Market",
      status: "Upward Price Trend (+8.8%)",
      detail: `Current Pune mandi rate is ₹${(market?.currentPrice || 2850).toLocaleString()}/qtl. Tightening local arrivals support firm pricing.`,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      borderColor: "border-emerald-300",
      icon: TrendingUp
    },
    {
      id: "crop_stage",
      title: "4. Crop Stage",
      status: currentAnalysis?.stage || "Fruiting",
      detail: "Dense canopy holds microclimate moisture. Foliage health is critical to support fruit development and prevent sunscald.",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      borderColor: "border-purple-300",
      icon: Sprout
    }
  ];

  const nextSteps = [
    { id: 1, step: "Inspect affected plants", detail: "Examine 10–15 sample plants across the field. Quantify whether spots are restricted to lower leaves.", priority: "High", type: "Field Inspection", done: false },
    { id: 2, step: "Monitor disease spread", detail: "Observe whether dark lesions expand into newly developing leaves or fruit calyx in 48 hours.", priority: "High", type: "Monitoring", done: false },
    { id: 3, step: "Check upcoming rainfall", detail: "Avoid spraying immediately prior to rain; high rain probability washes untreated foliar protectors.", priority: "Moderate", type: "Weather Planning", done: false },
    { id: 4, step: "Review local market prices", detail: "Monitor daily APMC rates in Pune and Narayangaon. Plan selective early pickings as fruit reaches breaker stage.", priority: "Moderate", type: "Market Planning", done: false },
    { id: 5, step: "Record changes in crop condition", detail: "Capture a follow-up photo in 3 days under daylight to document whether symptoms stabilize.", priority: "Recommended", type: "Documentation", done: false }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
            <span>Holistic Farm Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            KrishiMind Decision Support
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Synthesizing crop health, weather conditions, growth stage, and market dynamics into practical agricultural decision support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-stone-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Advisory</span>
          </button>
        </div>
      </div>

      {/* Summary Card: Current Situation */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Synthesized Assessment
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">
          Current Situation
        </h2>
        <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-3xl font-medium">
          "Your {currentAnalysis?.crop?.toLowerCase() || 'tomato'} crop is in the {currentAnalysis?.stage?.toLowerCase() || 'fruiting'} stage. The system has identified moderate crop-health risk, high humidity and an upward market-price trend."
        </p>

        <div className="mt-6 pt-5 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Crop: {currentAnalysis?.crop || 'Tomato'} ({currentAnalysis?.variety || 'Abhinav'})</span>
            <span>•</span>
            <span>Plot: {currentAnalysis?.location || 'Pune, Maharashtra'}</span>
          </div>
          <span className="text-emerald-300/80">Updated based on latest input</span>
        </div>
      </div>

      {/* Factors to Consider */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-stone-900">
            Factors to Consider
          </h2>
          <p className="text-xs text-stone-500">
            The four interrelated dimensions affecting your upcoming farm decisions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {factors.map((f) => {
            const IconComponent = f.icon;
            return (
              <div
                key={f.id}
                className={`bg-white rounded-2xl p-5 border ${f.borderColor} shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">{f.title}</h3>
                    </div>
                  </div>

                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border mb-2.5 ${f.badgeColor}`}>
                    {f.status}
                  </span>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {f.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Next Steps (Checklist) */}
      <RecommendationCard
        title="Suggested Next Steps"
        subtitle="Field inspection, weather management, and harvest monitoring checklist"
        steps={nextSteps}
      />

      {/* Important Advisory Ethics Banner */}
      <div className="p-4 bg-stone-100/90 rounded-2xl border border-stone-300/70 text-stone-700 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Advisory Principle:</strong> KrishiMind recommendations are presented strictly as decision-support information based on observed symptoms and meteorological trends. They are not guaranteed agronomic instructions or binding financial mandates. Farmers should corroborate observations with field checks and local KVK officers before making high-stakes treatment or sales decisions.
        </p>
      </div>
    </div>
  );
}
