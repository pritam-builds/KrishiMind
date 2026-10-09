// src/pages/Recommendations.jsx
import React, { useState } from 'react';
import { useCrop } from '../context/CropContext';
import { useI18n } from '../i18n';
import RecommendationCard from '../components/RecommendationCard';
import {
  Lightbulb,
  Activity,
  ShieldCheck,
  AlertCircle,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recommendations() {
  const { currentAnalysis } = useCrop();
  const { t, formatDate } = useI18n();
  const assessment = currentAnalysis?.assessment;
  const receivedInputs = currentAnalysis?.receivedInputs || {};
  const observedSymptoms = receivedInputs.symptoms || [];
  const fieldObservations = receivedInputs.fieldObservations || {};
  const assessmentFactors = assessment?.factors || currentAnalysis?.factors || [];
  const recommendations = assessment?.suggestedNextSteps || currentAnalysis?.suggestedNextSteps || [];
  const hasAssessment = Boolean(assessment);

  const factors = assessmentFactors.map((factor, index) => {
    const points = Number(factor.points) || 0;
    const color = points > 0
      ? {
          badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
          borderColor: "border-amber-300"
        }
      : points < 0
        ? {
            badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
            borderColor: "border-emerald-300"
          }
        : {
            badgeColor: "bg-stone-100 text-stone-700 border-stone-300",
            borderColor: "border-stone-300"
          };
    return {
      id: `factor-${index}`,
        title: t(factor.title),
        status: t(factor.metric || factor.status),
        detail: t(factor.description),
      ...color
    };
  });

  const nextSteps = recommendations.map((recommendation, index) => ({
    id: `assessment-step-${index}`,
    step: t(typeof recommendation === 'string' ? recommendation : recommendation.text),
    detail: typeof recommendation === 'string' ? '' : t(recommendation.detail),
    type: t("Assessment follow-up"),
    done: false
  }));
  const symptomSummary = observedSymptoms.length
    ? observedSymptoms.map(symptom => t(symptom.replace(/_/g, ' '))).join(', ')
    : t("no symptoms selected");
  const observationSummary = [
    fieldObservations.soilCondition && `${t("Soil:")} ${t(fieldObservations.soilCondition)}`,
    fieldObservations.recentRainfall && `${t("Recent rainfall:")} ${t(fieldObservations.recentRainfall)}`,
    fieldObservations.irrigationCondition && `${t("Irrigation:")} ${t(fieldObservations.irrigationCondition)}`,
    fieldObservations.spreadSpeed && fieldObservations.spreadSpeed !== "Not sure" && `${t("Spread:")} ${t(fieldObservations.spreadSpeed)}`,
    fieldObservations.additionalObservation
  ].filter(Boolean).join('; ');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("Holistic Farm Intelligence")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t("KrishiMind Decision Support")}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            {t("Field follow-up guidance based on the latest crop assessment and farmer-reported observations.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-stone-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t("Print Advisory")}</span>
          </button>
        </div>
      </div>

      {/* Summary Card: Current Situation */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            {t("Synthesized Assessment")}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">
          {t("Current Situation")}
        </h2>
        <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-3xl font-medium">
          {hasAssessment
            ? `${t("Assessment for {crop} at {stage} stage: {category} risk indicator ({score}/100). Selected symptoms: {symptoms}.", {
                crop: currentAnalysis.crop,
                stage: t(currentAnalysis.stage),
                category: t(assessment.riskCategory),
                score: assessment.riskScore,
                symptoms: symptomSummary
              })}${observationSummary ? ` ${t("Reported field observations: {observations}.", { observations: observationSummary })}` : ''}`
            : t("No submitted crop assessment is available yet. Submit crop details and field observations to view assessment-specific next steps.")}
        </p>

        <div className="mt-6 pt-5 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            {hasAssessment ? (
              <>
                <span>{t("Crop:")} {currentAnalysis.crop} ({t(currentAnalysis.stage)})</span>
                <span>•</span>
                <span>{t("Plot:")} {currentAnalysis.location || t('Not provided')}</span>
              </>
            ) : (
              <Link to="/farmer?action=analyze" className="underline underline-offset-2">{t("Start a crop assessment")}</Link>
            )}
          </div>
          <span className="text-emerald-300/80">
            {assessment?.assessedAt ? `${t("Assessed")} ${formatDate(new Date(assessment.assessedAt), { dateStyle: 'medium', timeStyle: 'short' })}` : t("Assessment data not available")}
          </span>
        </div>
      </div>

      {/* Factors to Consider */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-stone-900">
            {t("Factors to Consider")}
          </h2>
          <p className="text-xs text-stone-500">
            {t("Reported inputs that contributed to this assessment score")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {factors.map((f) => {
            return (
              <div
                key={f.id}
                className={`bg-white rounded-2xl p-5 border ${f.borderColor} shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                        <Activity className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">{t(f.title)}</h3>
                    </div>
                  </div>

                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border mb-2.5 ${f.badgeColor}`}>
                    {t(f.status)}
                  </span>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t(f.detail)}
                  </p>
                </div>
              </div>
            );
          })}
          {!factors.length && (
            <p className="text-sm text-stone-500">
              {t("Assessment factors will appear here after a crop assessment is submitted.")}
            </p>
          )}
        </div>
      </div>

      {/* Suggested Next Steps (Checklist) */}
      <RecommendationCard
        title={t("Suggested Next Steps")}
        subtitle={t("Generated from the selected symptoms and reported field conditions")}
        steps={nextSteps}
      />

      {/* Important Advisory Ethics Banner */}
      <div className="p-4 bg-stone-100/90 rounded-2xl border border-stone-300/70 text-stone-700 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>{t("Uncertainty:")}</strong> {t("This is a transparent rule-based indicator using farmer-reported inputs, not a diagnosis. Visual disease detection is not connected. Confirm observations in the field and consult a local agricultural extension officer if crop condition worsens. No treatment dosage, yield prediction, or financial instruction is provided.")}
        </p>
      </div>
    </div>
  );
}
