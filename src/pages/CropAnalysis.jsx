// src/pages/CropAnalysis.jsx
import React, { useState } from 'react';
import { useCrop } from '../context/CropContext';
import RiskGauge from '../components/RiskGauge';
import RiskCard from '../components/RiskCard';
import {
  Sprout,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Circle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  Camera,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CropAnalysis() {
  const { currentAnalysis } = useCrop();

  const [checklist, setChecklist] = useState(
    currentAnalysis?.whatToCheckNext || [
      { id: 1, text: "Inspect nearby plants across 10 random spots in the plot to evaluate spread pattern", checked: false },
      { id: 2, text: "Check the underside of affected leaves for fuzzy spore growth or tiny pest colonies", checked: false },
      { id: 3, text: "Monitor whether spots are actively spreading upward to newer canopy leaves over next 48 hours", checked: false },
      { id: 4, text: "Check soil moisture — avoid flood irrigation or evening watering that prolongs wet leaves", checked: false },
      { id: 5, text: "Review upcoming 5-day weather conditions for rain and high humidity before spraying", checked: false },
      { id: 6, text: "Consult a local agricultural extension officer (KVK) if symptoms worsen or spread to green fruit", checked: false }
    ]
  );

  const toggleCheck = (id) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const completedCount = checklist.filter(c => c.checked).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Potential Crop Health Risk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Crop Health & Risk Assessment
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Visual symptoms and environmental conditions indicate a possible crop health issue.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-stone-500">
            <span className="font-bold text-stone-800">Crop: {currentAnalysis?.crop || "Tomato"}</span>
            <span>•</span>
            <span>Variety: {currentAnalysis?.variety || "Abhinav (F1)"}</span>
            <span>•</span>
            <span>Stage: <span className="font-semibold text-emerald-800">{currentAnalysis?.stage || "Fruiting"}</span></span>
            <span>•</span>
            <span>Location: {currentAnalysis?.location || "Pune, Maharashtra"}</span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 shrink-0">
          <Link
            to="/recommendation"
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-2xl shadow-sm transition-all"
          >
            <span>Decision Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/farmer?action=analyze"
            className="inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2.5 px-4 rounded-xl border border-stone-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Visual Observation + Risk Assessment Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================
            SECTION A — VISUAL OBSERVATION (7 cols on lg)
        ======================================================== */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  A
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  Visual Observation
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {currentAnalysis?.imagePresent ? "Photo Attached" : "No Photo Attached"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              {/* Plant photo */}
              <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 aspect-4/3 flex items-center justify-center group shadow-xs">
                {currentAnalysis?.imagePresent && currentAnalysis?.visualObservations?.image ? (
                  <>
                    <img
                      src={currentAnalysis.visualObservations.image}
                      alt="Farmer-provided crop photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] px-2.5 py-1.5 rounded-xl flex items-center justify-between">
                      <span className="font-medium">Farmer-Provided Photo</span>
                      <span className="text-emerald-300 font-semibold">{currentAnalysis?.crop || "Crop"}</span>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-sm text-stone-300">
                    No photo was provided for this assessment.
                  </div>
                )}
              </div>

              {/* Farmer-Reported Concerns */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Farmer-Reported Concerns
                </h4>

                <div className="space-y-2">
                  {(currentAnalysis?.concerns || []).map((concern, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200/70"
                    >
                      <span className="text-xs font-bold text-stone-900">{concern}</span>
                    </div>
                  ))}
                  {(!currentAnalysis?.concerns || currentAnalysis.concerns.length === 0) && (
                    <p className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-[11px] text-stone-600">
                      No specific concerns were reported.
                    </p>
                  )}
                </div>

                <div className="text-xs text-stone-500 font-medium pt-1">
                  Spread rate: <strong className="text-stone-800">{currentAnalysis?.visualObservations?.spreadRate || "Moderately spreading"}</strong>
                </div>
                <p className="text-[11px] text-stone-500">
                  Photo analysis status: {currentAnalysis?.imageAnalysisStatus || "NOT_CONNECTED"}. The image is not analyzed by AI.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
            The risk indicator is calculated from the submitted crop details and farmer-reported field observations.
          </div>
        </div>

        {/* ========================================================
            SECTION C — RISK ASSESSMENT GAUGE (5 cols on lg)
        ======================================================== */}
        <div className="lg:col-span-5">
          <RiskGauge
            score={currentAnalysis?.riskScore || 72}
            label={currentAnalysis?.riskBand || "Moderate–High Risk"}
            title="Crop Health Risk Assessment"
            disclaimer="Confidence depends on image quality, crop stage and available field information. This system provides decision support, not guaranteed disease detection."
          />
        </div>
      </div>

      {/* ========================================================
          SECTION B — RISK FACTORS
      ======================================================== */}
      <div>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-200">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
            B
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Contributing Risk Factors
            </h3>
            <p className="text-xs text-stone-500">
              Environmental, growth stage, and symptomatic indicators compounding current risk
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(currentAnalysis?.riskFactors || [
            { title: "High Humidity", metric: "78% RH", status: "High", badgeColor: "bg-red-50 text-red-700 border-red-200", description: "Sustained high humidity creates ideal microclimate conditions for fungal spore germination." },
            { title: "Recent Rainfall", metric: "Moderate (24mm)", status: "Elevated", badgeColor: "bg-amber-50 text-amber-700 border-amber-200", description: "Rain splash transfers soil-borne fungal spores onto lower leaves and keeps foliage damp." },
            { title: "Fruiting Stage", metric: "High canopy density", status: "Sensitive", badgeColor: "bg-amber-50 text-amber-700 border-amber-200", description: "Dense canopy holds moisture and developing fruit relies heavily on photosynthetic foliage." },
            { title: "Leaf Spot Symptoms", metric: "Brown lesions", status: "Active", badgeColor: "bg-red-50 text-red-700 border-red-200", description: "Necrotic spots indicate active foliar disturbance requiring close monitoring." }
          ]).map((factor, idx) => (
            <RiskCard
              key={idx}
              title={factor.title}
              metric={factor.metric}
              status={factor.status}
              badgeColor={factor.badgeColor}
              description={factor.description}
            />
          ))}
        </div>
      </div>

      {/* ========================================================
          SECTION D — WHAT MAY BE HAPPENING?
      ======================================================== */}
      <div className="bg-stone-100/90 rounded-3xl p-6 sm:p-7 border border-stone-300/70">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-stone-200">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
            D
          </div>
          <h3 className="text-base font-bold text-stone-900">
            What May Be Happening?
          </h3>
        </div>

        <p className="text-sm text-stone-800 leading-relaxed font-medium">
          {currentAnalysis?.whatMayBeHappening ||
            "The observed leaf spots combined with recent rainfall and humid conditions may indicate increased risk of a fungal-related crop health issue (such as early blight tendencies). Visual symptoms and environmental conditions indicate a possible crop health issue."
          }
        </p>

        <div className="mt-4 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p>
            <strong>Decision Support Note:</strong> KrishiMind does not claim a definitive or guaranteed disease diagnosis. Plant stresses often exhibit overlapping symptoms with nutritional deficiencies or bacterial blemishes. Always correlate with on-field tactile inspection.
          </p>
        </div>
      </div>

      {/* ========================================================
          SECTION E — WHAT TO CHECK NEXT
      ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              E
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                What To Check Next
              </h3>
              <p className="text-xs text-stone-500">
                Actionable inspection steps to verify field conditions
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full self-start sm:self-auto">
            {completedCount} of {checklist.length} Inspected
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                item.checked
                  ? 'border-emerald-300 bg-emerald-50/50 text-stone-700'
                  : 'border-stone-200 bg-white hover:border-emerald-400 hover:bg-stone-50/50 text-stone-800'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 shrink-0 text-stone-400 hover:text-emerald-600 transition-colors"
                aria-label={item.checked ? "Mark uninspected" : "Mark inspected"}
              >
                {item.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium leading-relaxed ${item.checked ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link to Decision Support */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-stone-500">
            Synthesize this assessment with upcoming weather and local mandi prices
          </span>

          <Link
            to="/recommendation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs transition-colors"
          >
            <span>Proceed to Decision Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
