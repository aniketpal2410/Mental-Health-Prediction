import React from 'react';
import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';

export function StressSelector({ value, onChange, error }) {
  const options = [
    { 
      id: 'Low', 
      label: 'Low', 
      icon: Smile,
      dotColor: 'bg-emerald-500',
    },
    { 
      id: 'Medium', 
      label: 'Medium', 
      icon: Meh,
      dotColor: 'bg-blue-500',
    },
    { 
      id: 'High', 
      label: 'High', 
      icon: Frown,
      dotColor: 'bg-amber-500',
    },
    { 
      id: 'Very High', 
      label: 'Very High', 
      icon: AlertCircle,
      dotColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs sm:text-[13px] font-semibold text-[#10244A]">
        Stress Level
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`py-2.5 px-2 sm:px-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#1769E8] text-white border-[#1769E8] shadow-sm'
                  : 'bg-white text-[#4A5E7D] border-[#E2EBF6] hover:bg-slate-50/60 hover:border-blue-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : opt.dotColor}`} />
              <Icon className="w-4 h-4 shrink-0" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
}
