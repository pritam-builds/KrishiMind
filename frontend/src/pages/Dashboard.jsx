// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCrop } from '../context/CropContext';
import StatCard from '../components/StatCard';
import CropCard from '../components/CropCard';
import CropForm from '../components/CropForm';
import { useI18n } from '../i18n';
import {
  Sparkles,
  MapPin,
  Activity,
  CloudSun,
  TrendingUp,
  Droplets,
  CloudRain,
  Sprout,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentAnalysis, weather, market, history, profile } = useCrop();
  const { t, formatDate } = useI18n();

  const isAnalyzeMode = searchParams.get('action') === 'analyze';

  const toggleAnalyzeMode = (show) => {
    if (show) {
      setSearchParams({ action: 'analyze' });
    } else {
      setSearchParams({});
    }
  };

  // Farmer greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  const displayDate = (item) => {
    const parsedDate = new Date(item.assessedAt || item.date);
    return Number.isNaN(parsedDate.getTime())
      ? item.date
      : formatDate(parsedDate, { dateStyle: 'medium' });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Greetings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t(getGreeting())}, {profile?.name?.split(' ')[0] || t('Farmer')}
            </h1>
            <span className="text-xl">🌱</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{profile?.village || 'Khed Shivapur'}, {profile?.district || 'Pune'}, {profile?.state || 'Maharashtra'}</span>
            <span className="text-stone-300">•</span>
            <span>{profile?.farmSize || '3.5 Acres'}</span>
          </p>
        </div>

        {/* Quick Action Button */}
        <div>
          {!isAnalyzeMode ? (
            <button
              type="button"
              onClick={() => toggleAnalyzeMode(true)}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3 px-5 rounded-2xl shadow-sm shadow-emerald-800/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{t("+ Analyze New Crop")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => toggleAnalyzeMode(false)}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-stone-200 transition-colors"
            >
              <span>{t("← Back to Dashboard")}</span>
            </button>
          )}
        </div>
      </div>

      {/* View Switcher Tabs for Farmer */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-200/70 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => toggleAnalyzeMode(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !isAnalyzeMode
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t("Dashboard Overview")}</span>
        </button>
        <button
          type="button"
          onClick={() => toggleAnalyzeMode(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isAnalyzeMode
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("Tell Us About Your Crop (Input Form)")}</span>
        </button>
      </div>

      {/* If Analyze Mode is requested, display the Farmer Input Form */}
      {isAnalyzeMode ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">{t("Crop Health & Observation Form")}</h2>
            <button
              onClick={() => toggleAnalyzeMode(false)}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              {t("Cancel")}
            </button>
          </div>
          <CropForm onCancel={() => toggleAnalyzeMode(false)} />
        </div>
      ) : (
        /* Regular Dashboard View */
        <div className="space-y-8">
          {/* Three Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Crop Health Card */}
            <StatCard
              title="Crop Health"
              value={t(currentAnalysis?.overallHealth || "Moderate Risk")}
              subValue={`${t("Risk Score")}: ${currentAnalysis?.riskScore || 72}/100`}
              icon={Activity}
              badgeText={t("Action Recommended")}
              badgeColor="bg-amber-100 text-amber-800 border border-amber-200"
              trendText={t("Foliage Under Check")}
              trendType="neutral"
              onClick={() => {}}
            />

            {/* Weather Card */}
            <StatCard
              title={t("Weather")}
              value={`${weather?.currentTemp || 28}°C`}
              subValue={`${weather?.rainProbability || 65}% ${t("rain probability")}`}
              icon={CloudSun}
              badgeText={`78% ${t("Humidity")}`}
              badgeColor="bg-blue-100 text-blue-800 border border-blue-200"
              trendText={t("Rain anticipated")}
              trendType="up"
              onClick={() => {}}
            />

            {/* Market Card */}
            <StatCard
              title={t("Market")}
              value={`₹${market?.currentPrice?.toLocaleString() || '2,850'}/Qtl`}
              subValue={`${market?.crop || 'Tomato'} • Pune APMC`}
              icon={TrendingUp}
              badgeText={`+${market?.priceChangePct || 8.8}%`}
              badgeColor="bg-emerald-100 text-emerald-800 border border-emerald-200"
              trendText={t("Trending upward")}
              trendType="up"
              onClick={() => {}}
            />
          </div>

          {/* Your Latest Crop Analysis */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  {t("Your Latest Crop Analysis")}
                </h2>
                <p className="text-xs text-stone-500">
                  {t("Field observations and environmental risk assessment")}
                </p>
              </div>

              <Link
                to="/crop-analysis"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>{t("Full Assessment Report")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CropCard
              crop={currentAnalysis?.crop || "Tomato"}
              variety={currentAnalysis?.variety || "Abhinav (F1)"}
              stage={t(currentAnalysis?.stage || "Fruiting")}
              location={currentAnalysis?.location || "Pune, Maharashtra"}
              date={currentAnalysis?.date ? formatDate(new Date(currentAnalysis.date), { dateStyle: 'medium' }) : "19 Sep 2026"}
              riskScore={currentAnalysis?.riskScore || 72}
              riskBand={t(currentAnalysis?.riskBand || "Moderate–High Risk")}
              showAction={true}
              actionText={t("View Detailed Health Assessment & Risk Factors")}
              actionLink="/crop-analysis"
            />
          </div>

          {/* Important Factors Section */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                {t("Important Factors to Consider")}
              </h2>
              <p className="text-xs text-stone-500">
                {t("Key environmental and crop indicators synthesized by KrishiMind")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Factor 1: Humidity */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t("Microclimate")}</span>
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">78% {t("Humidity")}</h3>
                <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-red-50 text-red-700 border border-red-200">
                  {t("High Risk for Spores")}
                </span>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {t("Elevated moisture levels promote leaf spot fungal germination.")}
                </p>
              </div>

              {/* Factor 2: Rainfall */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t("Precipitation")}</span>
                  <CloudRain className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">65% {t("Rain Probability")}</h3>
                <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  {t("Moderate Risk")}
                </span>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {t("Upcoming showers may prolong foliar wetness; delay wash-off prone sprays.")}
                </p>
              </div>

              {/* Factor 3: Crop stage */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t("Crop Stage")}</span>
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">{t("Fruiting Stage")}</h3>
                <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  {t("Sensitive Period")}
                </span>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {t("Protecting healthy canopy maintains fruit bulking and prevents sunscald.")}
                </p>
              </div>

              {/* Factor 4: Market trend */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t("Market Dynamics")}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">+8.8% Upward</h3>
                <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t("Favorable Mandi Rate")}
                </span>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {t("₹2,850/qtl at Pune APMC; monitor harvest timing as fruit matures.")}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity / Previous Analyses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  {t("Recent Activity")}
                </h2>
                <p className="text-xs text-stone-500">
                  {t("Historical field records and past crop assessments")}
                </p>
              </div>

              <Link
                to="/history"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>{t("View Full History")} ({history?.length || 0})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
              <div className="divide-y divide-stone-100">
                {(history || []).slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <Sprout className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{item.crop}</h4>
                          <span className="text-[11px] text-stone-500 font-medium">({t(item.stage)})</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                          <span>{displayDate(item)}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          item.riskScore >= 68
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : item.riskScore >= 45
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {t(item.riskLevel || 'Moderate Risk')}
                      </span>

                      <Link
                        to="/crop-analysis"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        {t("Details →")}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
