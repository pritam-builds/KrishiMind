// src/components/SymptomSelector.jsx
import React from 'react';
import { commonSymptomsList } from '../data/mockData';
import { Check, Clock } from 'lucide-react';

export default function SymptomSelector({
  selectedSymptoms = [],
  onChangeSymptoms,
  spreadSpeed = "Moderately",
  onChangeSpreadSpeed
}) {
  const spreadOptions = [
    { id: "Not spreading", label: "Not spreading", desc: "Isolated single leaf or plant" },
    { id: "Slowly", label: "Slowly", desc: "Few new spots over 7+ days" },
    { id: "Moderately", label: "Moderately", desc: "Noticeable increase over 3–5 days" },
    { id: "Quickly", label: "Quickly", desc: "Rapid canopy involvement in 24–48h" }
  ];

  const handleToggleSymptom = (id) => {
    if (id === 'no_visible') {
      // If choosing "No visible symptoms", clear others
      if (selectedSymptoms.includes('no_visible')) {
        onChangeSymptoms([]);
      } else {
        onChangeSymptoms(['no_visible']);
      }
      return;
    }

    // If choosing any symptom, remove "no_visible"
    let updated = selectedSymptoms.filter(item => item !== 'no_visible');
    if (updated.includes(id)) {
      updated = updated.filter(item => item !== id);
    } else {
      updated.push(id);
    }
    onChangeSymptoms(updated);
  };

  return (
    <div className="space-y-6">
      {/* Symptoms list */}
      <div>
        <label className="block text-sm font-bold text-stone-900 mb-1">
          What are you observing on your crop? <span className="text-emerald-700">*</span>
        </label>
        <p className="text-xs text-stone-500 mb-3">
          Select all visible signs observed on your leaves, stems, or fruits.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {commonSymptomsList.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            return (
              <button
                type="button"
                key={symptom.id}
                onClick={() => handleToggleSymptom(symptom.id)}
                className={`relative p-3 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[76px] ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-600'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <span className="text-xs">{symptom.label}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ml-1 transition-colors ${
                      isSelected ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-normal mt-1">
                  {symptom.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spread speed */}
      <div className="pt-2 border-t border-stone-100">
        <label className="block text-sm font-bold text-stone-900 mb-1">
          How quickly is the problem spreading?
        </label>
        <p className="text-xs text-stone-500 mb-3">
          Helps evaluate disease pressure and progression urgency.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {spreadOptions.map((option) => {
            const isSelected = spreadSpeed === option.id;
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => onChangeSpreadSpeed(option.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span className="text-xs font-bold">{option.label}</span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal leading-tight">
                  {option.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
