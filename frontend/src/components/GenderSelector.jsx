import React from 'react';
import { User, Users } from 'lucide-react';

export function GenderSelector({ value, onChange, error }) {
  const options = [
    { id: 'Male', label: 'Male', icon: User },
    { id: 'Female', label: 'Female', icon: User },
    { id: 'Others', label: 'Others', icon: Users },
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs sm:text-[13px] font-semibold text-[#10244A]">
        Gender
      </label>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`py-2.5 sm:py-3 px-1.5 sm:px-3 rounded-xl border text-[11px] sm:text-sm font-semibold flex items-center justify-center space-x-1 sm:space-x-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#1769E8] text-white border-[#1769E8] shadow-sm'
                  : 'bg-white text-[#4A5E7D] border-[#E2EBF6] hover:border-blue-300 hover:bg-slate-50/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-white' : 'text-[#8FA1B8]'}`} />
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
