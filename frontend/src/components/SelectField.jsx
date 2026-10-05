import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  GraduationCap, 
  Monitor, 
  MessageSquare, 
  ChevronDown, 
  Search, 
  Check 
} from 'lucide-react';

const ICON_MAP = {
  globe: Globe,
  academic: GraduationCap,
  platform: Monitor,
  purpose: MessageSquare,
};

export function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  required = false,
  error = null,
  iconName,
  searchable = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const Icon = ICON_MAP[iconName];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Standard native select
  if (!searchable) {
    return (
      <div className="space-y-1.5 text-left">
        <label 
          htmlFor={name}
          className="block text-xs sm:text-[13px] font-semibold text-[#10244A]"
        >
          {label}
        </label>
        
        <div className="relative">
          {Icon && (
            <Icon className="w-4 h-4 text-[#8FA1B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
          <select
            id={name}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            className={`w-full bg-white border border-[#E2EBF6] rounded-xl py-2.5 sm:py-3 text-sm text-[#10244A] appearance-none cursor-pointer focus:outline-none focus:border-[#1769E8] focus:ring-2 focus:ring-blue-100 transition-all duration-200 pr-10 ${
              Icon ? 'pl-10' : 'px-4'
            } ${error ? 'border-rose-400 ring-2 ring-rose-100' : ''}`}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((opt) => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={optVal} value={optVal}>{optLabel}</option>
              );
            })}
          </select>
          <ChevronDown className="w-4 h-4 text-[#8FA1B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
            <span>•</span> {error}
          </p>
        )}
      </div>
    );
  }

  // Custom searchable dropdown for Country
  const filtered = options.filter(opt => {
    const text = typeof opt === 'object' ? opt.label : opt;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedItem = options.find(opt => {
    const val = typeof opt === 'object' ? opt.value : opt;
    return val === value;
  });

  const displayLabel = selectedItem 
    ? (typeof selectedItem === 'object' ? selectedItem.label : selectedItem)
    : placeholder;

  const handleSelect = (itemVal) => {
    onChange({ target: { name, value: itemVal } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-1.5 text-left" ref={wrapperRef}>
      <label 
        className="block text-xs sm:text-[13px] font-semibold text-[#10244A]"
      >
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border border-[#E2EBF6] rounded-xl py-2.5 sm:py-3 text-sm text-left flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#1769E8] focus:ring-2 focus:ring-blue-100 transition-all duration-200 pr-4 ${
            Icon ? 'pl-10' : 'px-4'
          } ${error ? 'border-rose-400 ring-2 ring-rose-100' : ''}`}
        >
          {Icon && (
            <Icon className="w-4 h-4 text-[#8FA1B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
          <span className={`block truncate ${!selectedItem ? 'text-[#8FA1B8] text-xs sm:text-sm' : 'text-[#10244A] font-medium'}`}>
            {displayLabel}
          </span>
          <ChevronDown className={`w-4 h-4 text-[#8FA1B8] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1769E8]' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-2 space-y-1.5 max-h-60 overflow-hidden flex flex-col animate-fadeIn">
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1769E8]"
              />
            </div>

            <div className="overflow-y-auto space-y-0.5 flex-1 pr-1">
              {filtered.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-3">No matching countries</div>
              ) : (
                filtered.map((opt) => {
                  const optVal = typeof opt === 'object' ? opt.value : opt;
                  const optLabel = typeof opt === 'object' ? opt.label : opt;
                  const isSelected = optVal === value;

                  return (
                    <button
                      key={optVal}
                      type="button"
                      onClick={() => handleSelect(optVal)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-[#1769E8] font-bold'
                          : 'text-[#10244A] hover:bg-slate-50'
                      }`}
                    >
                      <span>{optLabel}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1769E8]" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 pt-0.5">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
}
