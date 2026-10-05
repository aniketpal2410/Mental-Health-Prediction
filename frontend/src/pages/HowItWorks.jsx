import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ClipboardList, Cpu, BarChart3, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Tell Us About Yourself',
      desc: 'Answer a few quick questions regarding your age, background, and academic rhythm.',
      icon: ClipboardList,
    },
    {
      num: '02',
      title: 'Analyze Your Lifestyle',
      desc: 'Share your screen time, daily unlocks, nightly sleep duration, and physical exercise habits.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Get Your Prediction',
      desc: 'Our trained Random Forest ML pipeline calculates your predicted mental health score.',
      icon: BarChart3,
    },
    {
      num: '04',
      title: 'Understand Your Habits',
      desc: 'Receive tailored self-care guidance and see exactly which habits contribute to your score.',
      icon: HeartHandshake,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mindcare-card p-6 sm:p-10 space-y-8 animate-fadeIn max-w-4xl mx-auto text-left">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Evaluation Flow
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
            How MindCare Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            A simple 4-step process connecting everyday lifestyle habits to machine learning insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div 
                key={st.num}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-blue-300">
                    {st.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Takes under 3 minutes. Completely confidential.
          </p>
          <Link
            to="/assessment"
            className="mindcare-btn-primary px-8 py-3 rounded-full text-sm font-bold flex items-center space-x-2"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
