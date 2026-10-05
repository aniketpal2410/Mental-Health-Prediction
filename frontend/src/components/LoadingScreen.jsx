import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export function LoadingScreen({ message = 'Analyzing your responses...' }) {
  return (
    <div className="min-h-[420px] mindcare-card p-8 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
      {/* Pulsing Animated Brain Hub */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Ripple rings */}
        <div className="absolute inset-0 rounded-3xl bg-blue-400/20 animate-ping opacity-75" />
        <div className="absolute -inset-2 rounded-3xl bg-sky-200/40 animate-pulse" />
        
        {/* Central Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
          <Brain className="w-10 h-10 animate-bounce stroke-[2.2]" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>{message}</span>
          <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Executing scikit-learn preprocessing pipeline (log transformation, standard scaling, and one-hot encoding) via the RandomForestRegressor model.
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center space-x-2 pt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse delay-150" />
        <span className="w-2.5 h-2.5 rounded-full bg-blue-200 animate-pulse delay-300" />
      </div>
    </div>
  );
}
