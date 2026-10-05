import React from 'react';
import { Check } from 'lucide-react';

export function ProgressSteps({ currentStep = 1, onStepClick }) {
  const steps = [
    { num: 1, title: 'Personal Info', shortTitle: 'Info' },
    { num: 2, title: 'Lifestyle & Habits', shortTitle: 'Habits' },
    { num: 3, title: 'Academic & Usage', shortTitle: 'Usage' },
    { num: 4, title: 'Submit', shortTitle: 'Submit' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-4 sm:mb-5 px-1 sm:px-2 select-none">
      <div className="flex items-center justify-between relative">
        
        {/* Continuous Connecting Line */}
        <div className="absolute top-4 left-6 right-6 sm:left-8 sm:right-8 h-[2px] bg-[#BFDBFE] -z-0">
          <div 
            className="h-full bg-[#1769E8] transition-all duration-300 ease-out"
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>

        {steps.map((s) => {
          const isCompleted = currentStep > s.num;
          const isCurrent = currentStep === s.num;

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => onStepClick && onStepClick(s.num)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1769E8] text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100/90 scale-105'
                    : isCompleted
                    ? 'bg-[#1769E8] text-white'
                    : 'bg-[#DCEBFB] text-[#4A5E7D] hover:bg-blue-100'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : s.num}
              </button>

              <span className={`mt-1.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap ${
                isCurrent 
                  ? 'text-[#1769E8] font-bold' 
                  : isCompleted
                  ? 'text-[#10244A] font-semibold'
                  : 'text-[#6B7C96]'
              }`}>
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.shortTitle}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
