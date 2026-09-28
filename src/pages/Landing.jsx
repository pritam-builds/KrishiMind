// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Activity,
  CloudSun,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-800/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-stone-900 tracking-tight">KrishiMind</span>
              <p className="text-xs font-semibold text-emerald-700">AI-powered crop health & farm decision support</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/farmer"
              className="text-xs font-bold text-stone-700 hover:text-emerald-800 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors hidden sm:inline-block"
            >
              Farmer Portal
            </Link>
            <Link
              to="/farmer?action=analyze"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Analyze My Crop</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-8">
          {/* Subtle nature decorative backdrop */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-100/60 via-amber-50/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
              <Sprout className="w-4 h-4 text-emerald-700" />
              AI-powered crop health and farm decision support
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
              Understand Your Crop. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700">
                Decide With Better Information.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Add your crop details, observations and a photo to assess crop health, weather risk and market conditions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <Link
                to="/farmer?action=analyze"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-800/25 transition-all hover:translate-y-[-1px]"
              >
                <span>Start Crop Check</span>
                <ArrowRight className="w-5 h-5 text-emerald-200" />
              </Link>

              <Link
                to="/farmer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-800 font-bold text-base py-3.5 px-7 rounded-2xl border border-stone-300 shadow-xs transition-all"
              >
                <span>Explore Dashboard</span>
              </Link>
            </div>

            {/* Abstract Agricultural Visual Composition */}
            <div className="mt-14 max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl shadow-stone-200/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {/* Visual Indicator 1 */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Crop Health</span>
                    <Activity className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-lg font-bold text-stone-900">Risk Assessment</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Based on crop observations and image</p>
                </div>

                {/* Visual Indicator 2 */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Weather</span>
                    <CloudSun className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="text-lg font-bold text-stone-900">Local Conditions</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Weather factors affecting crop health</p>
                </div>

                {/* Visual Indicator 3 */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Market</span>
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-lg font-bold text-stone-900">Market Intelligence</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Price trends and local market conditions</p>
                </div>
              </div>

              {/* Integrated multi-factor badge */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Synthesizes Visuals + Microclimate + Mandi Dynamics</span>
                </div>
                <span className="text-stone-400">Ethical Decision Support • No False Medical Guarantees</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Feature Cards Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Three Pillars of Farm Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Actionable, grounded support designed for daily farming decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-5">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  1. Crop Health
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Analyze crop images and farmer observations to identify potential crop health risks.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700">
                <Link to="/farmer?action=analyze" className="inline-flex items-center gap-1 hover:underline">
                  Analyze leaf & symptoms →
                </Link>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 mb-5">
                  <CloudSun className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  2. Weather Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Understand how rainfall, temperature and humidity may affect your crop.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-blue-700">
                <Link to="/weather" className="inline-flex items-center gap-1 hover:underline">
                  View 5-day weather risks →
                </Link>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-5">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  3. Market Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Track market trends and understand recent price movements.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-amber-700">
                <Link to="/market" className="inline-flex items-center gap-1 hover:underline">
                  Explore APMC price trends →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Responsible Decision Support Banner */}
        <section className="py-10 px-4 sm:px-8 max-w-4xl mx-auto mb-8">
          <div className="bg-stone-100/90 border border-stone-300/70 rounded-3xl p-6 text-center">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 shadow-xs text-stone-700">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              Transparent Decision Support — Built for Indian Agriculture
            </h4>
            <p className="text-xs text-stone-600 max-w-xl mx-auto mt-1 leading-relaxed">
              KrishiMind presents results as crop health risk indicators and decision-support guidance. We do not make deceptive AI accuracy claims or guaranteed disease diagnoses.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-stone-800">KrishiMind</span>
            <span>— AI Crop Decision Support System</span>
          </div>
          <div>
            Tailored for Smart India Hackathon (SIH) & Indian Agricultural Extension
          </div>
        </div>
      </footer>
    </div>
  );
}
