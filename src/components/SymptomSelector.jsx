// src/components/SymptomSelector.jsx
import React from 'react';
import { commonSymptomsList } from '../data/mockData';
import { Check, Clock, AlertCircle, HelpCircle } from 'lucide-react';
import { useI18n } from '../i18n';

export default function SymptomSelector({
  selectedSymptoms = [],
  onChangeSymptoms,
  otherSymptomText = "",
  onChangeOtherText,
  spreadSpeed = "Moderately",
  onChangeSpreadSpeed
}) {
  const { t } = useI18n();
  const spreadOptions = [
    { id: "Slowly", label: "Slowly", desc: "Gradual spread over 7+ days" },
    { id: "Moderately", label: "Moderately", desc: "Noticeable increase over 3–5 days" },
    { id: "Quickly", label: "Quickly", desc: "Rapid canopy spread in 24–48 hours" },
    { id: "Not sure", label: "Not sure", desc: "Just noticed today" }
  ];

  const handleToggleSymptom = (id) => {
    let updated;
    if (selectedSymptoms.includes(id)) {
      updated = selectedSymptoms.filter(item => item !== id);
    } else {
      updated = [...selectedSymptoms, id];
    }
    onChangeSymptoms(updated);
  };

  const isOtherSelected = selectedSymptoms.includes('other');

  return (
    <div className="space-y-6">
      {/* Symptom Cards Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
          <label className="block text-sm font-bold text-stone-900">
            {t("Visible Crop Symptoms")} <span className="text-emerald-700">*</span>
          </label>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 w-fit">
            {selectedSymptoms.length > 0
              ? `${selectedSymptoms.length} ${t(selectedSymptoms.length === 1 ? 'symptom' : 'symptoms')} ${t('selected')}`
              : t('Select one or more')}
          </span>
        </div>
        <p className="text-xs text-stone-600 mb-3.5 leading-relaxed">
          {t("Tap each symptom you observe on your plants. The selected signs are scored as reported observations, not used to identify a disease.")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonSymptomsList.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            return (
              <button
                type="button"
                key={symptom.id}
                onClick={() => handleToggleSymptom(symptom.id)}
                className={`relative p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 font-semibold shadow-xs ring-1.5 ring-emerald-600'
                    : 'border-stone-200 bg-white hover:border-emerald-300 text-stone-800 hover:bg-stone-50/70 shadow-2xs'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg select-none" role="img" aria-hidden="true">
                      {symptom.icon || '🌱'}
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      {t(symptom.label)}
                    </span>
                  </div>

                  {/* Checkbox indicator */}
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'border border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 font-normal leading-relaxed">
                  {t(symptom.description)}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    {t(symptom.category)}
                  </span>
                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-emerald-800' : 'text-stone-400'}`}>
                    {isSelected ? `✓ ${t('Selected')}` : `+ ${t('Tap to add')}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* If 'Other' is selected, show an inline input */}
        {isOtherSelected && (
          <div className="mt-3.5 p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl animate-fadeIn">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              {t("Please specify the other symptom or sign:")}
            </label>
            <input
              type="text"
              value={otherSymptomText}
              onChange={(e) => onChangeOtherText && onChangeOtherText(e.target.value)}
              placeholder={t("e.g., White powdery coating, leaf curl, fruit rotting, bark splitting...")}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}
      </div>

      {/* Spread Progression Rate (Farmer Friendly) */}
      {onChangeSpreadSpeed && (
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <label className="text-xs font-bold text-stone-800">
              {t("How quickly are these symptoms spreading across the field?")}
            </label>
          </div>
          <p className="text-[11px] text-stone-500 mb-2.5">
            {t("Records the progression you have observed; it does not confirm a disease.")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {spreadOptions.map((option) => {
              const isSelected = spreadSpeed === option.id;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => onChangeSpreadSpeed(option.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                      : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">{t(option.label)}</div>
                  <div className="text-[10px] text-stone-500 font-normal leading-tight">
                    {t(option.desc)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
