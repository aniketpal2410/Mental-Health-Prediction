import React from 'react';
import { Link } from 'react-router-dom';
import logoBrainImg from '../assets/logo-brain.png';

export function Logo({ showTagline = true, className = "" }) {
  return (
    <Link to="/" className={`flex items-center space-x-3 group select-none ${className}`}>
      {/* Exact MindCare Brain Icon */}
      <img 
        src={logoBrainImg} 
        alt="MindCare" 
        className="w-8 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform" 
      />

      <div className="leading-tight text-left">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#10244A] group-hover:text-[#1769E8] transition-colors block">
          MindCare
        </span>
        {showTagline && (
          <span className="hidden sm:block text-[10px] sm:text-[11px] font-medium text-[#6B7C96] tracking-wider -mt-0.5 whitespace-nowrap">
            Predict · Understand · Take Action
          </span>
        )}
      </div>
    </Link>
  );
}
