import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  Brain, 
  Cpu, 
  Layers, 
  Database, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <DashboardLayout>
      <div className="mindcare-card p-6 sm:p-10 space-y-8 animate-fadeIn max-w-4xl mx-auto text-left">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            About MindCare
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
            Machine Learning Wellbeing Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Understand how our statistical model connects lifestyle patterns to mental health scores.
          </p>
        </div>

        {/* Disclaimer Card */}
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start space-x-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold text-amber-950">
              &ldquo;This tool provides an educational prediction and is not a medical diagnosis.&rdquo;
            </strong>
            <p className="text-amber-800 text-xs leading-relaxed">
              MindCare is an algorithmic self-reflection and lifestyle assessment tool. 
              It is not a clinical psychological evaluation. If you are experiencing distress, 
              please consult a healthcare professional.
            </p>
          </div>
        </div>

        {/* How It Works & ML Deep Dive */}
        <div id="how-it-works" className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-slate-900">
            How The Machine Learning Pipeline Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center space-x-2 font-bold text-blue-900">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>RandomForestRegressor</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Trained ensemble of decision trees capturing non-linear interactions between screen time, sleep duration, and study workloads.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center space-x-2 font-bold text-blue-900">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Full Preprocessing Pipeline</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Natively applies log1p transformation for study hours, StandardScaler for numerical metrics, and OneHot/Ordinal encoders.
              </p>
            </div>
          </div>
        </div>

        {/* 12 Features Breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900">
            12 Input Features
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <strong className="text-blue-800 block mb-1">6 Numerical Features:</strong>
              <ul className="space-y-1 text-slate-600">
                <li>• Study_Hours (log transformed & scaled)</li>
                <li>• Age</li>
                <li>• Avg_Daily_Usage_Hours</li>
                <li>• Daily_Unlocks</li>
                <li>• Physical_Activity_Hours</li>
                <li>• Sleep_Hours_Per_Night</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <strong className="text-blue-800 block mb-1">6 Categorical Features:</strong>
              <ul className="space-y-1 text-slate-600">
                <li>• Stress_Level (Low, Medium, High, Very High)</li>
                <li>• Gender (Male, Female, Others)</li>
                <li>• Academic_Level (High School, Undergrad, Grad)</li>
                <li>• Most_Used_Platform (12 platforms)</li>
                <li>• Purpose_Of_Use (4 categories)</li>
                <li>• Grouped_Country (10 regions)</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
