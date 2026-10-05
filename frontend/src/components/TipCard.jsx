import React from 'react';
import { Moon, Coffee, Activity, Sparkles, Users } from 'lucide-react';

const ICON_MAP = {
  moon: Moon,
  coffee: Coffee,
  activity: Activity,
  mindfulness: Sparkles,
  users: Users,
};

export function TipCard({
  title,
  description,
  iconName = 'moon',
  bgColor = 'bg-[#EDF5FF]',
  titleColor = 'text-[#1769E8]',
  iconColor = 'text-[#1769E8]',
}) {
  const Icon = ICON_MAP[iconName] || Moon;

  return (
    <div className={`p-3.5 sm:p-5 rounded-2xl ${bgColor} flex items-center space-x-3 sm:space-x-4 text-left transition-all duration-200 hover:shadow-xs group`}>
      {/* Icon with no harsh box around it, matching 04-tips.png */}
      <div className={`shrink-0 ${iconColor} transition-transform group-hover:scale-105`}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
      </div>

      <div className="space-y-0.5 flex-1 min-w-0">
        <h3 className={`text-sm sm:text-[15px] font-bold ${titleColor} truncate sm:whitespace-normal`}>
          {title}
        </h3>
        <p className="text-xs sm:text-[13px] text-[#4A5E7D] font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
