// src/components/RecommendationCard.jsx
import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Clock, ChevronRight } from 'lucide-react';

export default function RecommendationCard({
  steps = [],
  title = "Suggested Next Steps",
  subtitle = "Checklist-style recommendations for field inspection and risk mitigation"
}) {
  const [items, setItems] = useState(
    steps.map(s => ({ ...s, completed: s.done || false }))
  );

  const toggleItem = (id) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-lg font-bold text-stone-900">{title}</h3>
          <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full self-start sm:self-auto">
          {completedCount} of {items.length} Completed
        </div>
      </div>

      <div className="divide-y divide-stone-100 mt-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex items-start gap-3.5 ${
              item.completed ? 'bg-stone-50/60 opacity-80' : 'hover:bg-emerald-50/30'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
              aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Circle className="w-5 h-5 text-stone-300 hover:text-emerald-500" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-bold ${item.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                  {item.step || item.title}
                </span>
                {item.priority && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider ${
                    item.priority === 'High' || item.priority === 'High Priority'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {item.priority}
                  </span>
                )}
                {item.type && (
                  <span className="text-[11px] text-stone-400 font-medium">
                    • {item.type}
                  </span>
                )}
              </div>

              {(item.detail || item.description) && (
                <p className={`text-xs mt-1 leading-relaxed ${item.completed ? 'text-stone-400' : 'text-stone-600'}`}>
                  {item.detail || item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Actions are recommended as field decision-support guidelines, not absolute or guaranteed directives.</span>
      </div>
    </div>
  );
}
