import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Shield, PhoneCall } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-white/70 backdrop-blur-md border-t border-blue-100/80 pt-12 pb-8 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-sm">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                MindCare
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              &ldquo;Understand your mind. Take care of yourself.&rdquo;
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Empowering individuals with machine-learning-driven mental health insights
              by evaluating everyday digital exposure, sleep quality, and academic habits.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/assessment" className="hover:text-blue-600 transition-colors">Take Assessment</Link>
              </li>
              <li>
                <Link to="/about#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">About the ML Model</Link>
              </li>
            </ul>
          </div>

          {/* Crisis Hotline Card */}
          <div className="md:col-span-4 bg-blue-50/70 rounded-2xl p-4 border border-blue-100 space-y-2">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Immediate Support Helplines</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you or someone you know is in crisis, free and confidential support is always available:
            </p>
            <div className="text-xs text-blue-800 font-semibold space-y-1">
              <div>• USA/Canada: Call or text <strong>988</strong></div>
              <div>• UK: Call <strong>111</strong> or text SHOUT to <strong>85258</strong></div>
              <div>• India: Tele-MANAS at <strong>14416</strong></div>
            </div>
          </div>

        </div>

        {/* Disclaimer Banner */}
        <div className="pt-6 border-t border-slate-200/60 text-center space-y-3">
          <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed">
            <strong>Medical Disclaimer:</strong> MindCare provides informational lifestyle assessment 
            powered by machine learning. It is <strong>not</strong> a medical device, diagnostic test, or clinical 
            substitute for professional mental healthcare.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 pt-2">
            <span>© {new Date().getFullYear()} MindCare. All rights reserved.</span>
            <span>Designed for mindful wellbeing & digital health awareness.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
