// src/components/EmptyState.jsx
import React from 'react';
import { Sprout, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = Sprout,
  title = "No Data Found",
  description = "No crop assessments or records have been logged yet.",
  actionText,
  actionLink,
  onAction
}) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600 mb-4">
        <Icon className="w-8 h-8 text-emerald-700" />
      </div>
      <h3 className="text-lg font-bold text-stone-900 mb-1.5">{title}</h3>
      <p className="text-xs text-stone-500 leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
