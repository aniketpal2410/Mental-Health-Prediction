import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { TipCard } from '../components/TipCard';

export function Tips() {
  const tipsList = [
    {
      id: 1,
      title: 'Maintain a Healthy Sleep Routine',
      description: 'Try to get 7–8 hours of quality sleep every night.',
      iconName: 'moon',
      bgColor: 'bg-[#EDF5FF]',
      titleColor: 'text-[#1769E8]',
      iconColor: 'text-[#1769E8]',
    },
    {
      id: 2,
      title: 'Take Regular Breaks',
      description: 'Avoid excessive screen time and take short breaks.',
      iconName: 'coffee',
      bgColor: 'bg-[#EAF8F1]',
      titleColor: 'text-[#059669]',
      iconColor: 'text-[#10B981]',
    },
    {
      id: 3,
      title: 'Stay Physically Active',
      description: 'At least 30 minutes of exercise daily.',
      iconName: 'activity',
      bgColor: 'bg-[#FFF5EB]',
      titleColor: 'text-[#C2410C]',
      iconColor: 'text-[#EA580C]',
    },
    {
      id: 4,
      title: 'Practice Mindfulness',
      description: 'Try meditation or deep breathing exercises.',
      iconName: 'mindfulness',
      bgColor: 'bg-[#F5F0FF]',
      titleColor: 'text-[#7C3AED]',
      iconColor: 'text-[#8B5CF6]',
    },
    {
      id: 5,
      title: 'Stay Connected',
      description: 'Talk to friends or family when you feel stressed.',
      iconName: 'users',
      bgColor: 'bg-[#FFF0F3]',
      titleColor: 'text-[#1E40AF]',
      iconColor: 'text-[#2563EB]',
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center py-2 animate-fadeIn">
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 shadow-sm border border-blue-100/60 space-y-4 max-w-2xl w-full text-left select-none">
          
          {/* Title & Subtitle matching 04-tips.png */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#10244A] tracking-tight">
              Personalized Tips
            </h1>
            <p className="text-xs text-[#6B7C96] mt-0.5 font-normal">
              Based on your result, here are some suggestions for you.
            </p>
          </div>

          {/* 5 Vertically Stacked Tinted Cards matching 04-tips.png */}
          <div className="space-y-3 pt-1">
            {tipsList.map((tip) => (
              <TipCard
                key={tip.id}
                title={tip.title}
                description={tip.description}
                iconName={tip.iconName}
                bgColor={tip.bgColor}
                titleColor={tip.titleColor}
                iconColor={tip.iconColor}
              />
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
