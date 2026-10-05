import React from 'react';
import { User, Calendar, Clock, BookOpen, Smartphone, Moon, Activity } from 'lucide-react';

const ICON_MAP = {
  user: User,
  calendar: Calendar,
  clock: Clock,
  book: BookOpen,
  phone: Smartphone,
  moon: Moon,
  activity: Activity,
};

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  iconName,
  min,
  max,
  step,
  hint,
}) {
  const Icon = ICON_MAP[iconName];

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label 
          htmlFor={name}
          className="block text-xs sm:text-[13px] font-semibold text-[#10244A]"
        >
          {label}
        </label>
        {hint && (
          <span className="text-[11px] font-medium text-[#1769E8] bg-blue-50 px-2 py-0.5 rounded-md">
            {hint}
          </span>
        )}
      </div>

      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-[#8FA1B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full bg-white border border-[#E2EBF6] rounded-xl py-2.5 sm:py-3 text-sm text-[#10244A] placeholder:text-[#8FA1B8] placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:border-[#1769E8] focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${error ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : ''}`}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
}
