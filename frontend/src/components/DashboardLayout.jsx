import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ClipboardCheck, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Info,
} from 'lucide-react';
import botanicalBranchImg from '../assets/botanical-branch.png';
import resultLeavesImg from '../assets/result-leaves.png';

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const isAssessment = path === '/assessment';

  const menuItems = [
    {
      id: 'assessment',
      label: 'Assessment',
      path: '/assessment',
      icon: ClipboardCheck,
    },
    {
      id: 'result',
      label: 'Your Result',
      path: '/result',
      icon: FileText,
    },
    {
      id: 'history',
      label: 'History',
      path: '/history',
      icon: Clock,
    },
    {
      id: 'tips',
      label: 'Mental Health Tips',
      path: '/tips',
      icon: ShieldCheck,
    },
    {
      id: 'about',
      label: 'About',
      path: '/about',
      icon: Info,
    },
  ];

  return (
    <aside className="hidden lg:flex w-full lg:w-52 shrink-0 flex-col justify-between py-2 select-none min-h-[480px]">
      <div>
        {/* Navigation list matching 02-assessment.png, 03-result.png, 04-tips.png */}
        <nav className="space-y-1.5" aria-label="Sidebar navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = path === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1769E8] text-white shadow-md shadow-blue-500/25'
                    : 'text-[#4A5E7D] hover:text-[#10244A] hover:bg-blue-100/40'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#4A5E7D]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botanical foliage at bottom of sidebar matching references */}
      <div className="mt-8 pt-2 flex flex-col items-center">
        {isAssessment ? (
          <img 
            src={botanicalBranchImg} 
            alt="Take care of your mind" 
            className="w-24 sm:w-28 h-auto object-contain opacity-90 select-none pointer-events-none" 
          />
        ) : (
          <img 
            src={resultLeavesImg} 
            alt="Botanical leaves" 
            className="w-20 sm:w-24 h-auto object-contain opacity-90 select-none pointer-events-none" 
          />
        )}
      </div>
    </aside>
  );
}

export function MobileNav() {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { id: 'assessment', label: 'Assessment', path: '/assessment', icon: ClipboardCheck },
    { id: 'result', label: 'Your Result', path: '/result', icon: FileText },
    { id: 'history', label: 'History', path: '/history', icon: Clock },
    { id: 'tips', label: 'Tips', path: '/tips', icon: ShieldCheck },
    { id: 'about', label: 'About', path: '/about', icon: Info },
  ];

  return (
    <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-none flex items-center space-x-2 -mt-1 mb-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = path === item.path;

        return (
          <Link
            key={item.id}
            to={item.path}
            className={`shrink-0 flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              isActive
                ? 'bg-[#1769E8] text-white shadow-sm'
                : 'bg-white text-[#4A5E7D] border border-blue-100 hover:bg-blue-50/50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#4A5E7D]'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function DashboardLayout({ children }) {
  return (
    <div className="w-full max-w-[1360px] mx-auto px-3 sm:px-6 py-3 sm:py-6 select-none animate-fadeIn">
      {/* Mobile Horizontal Navigation Pills */}
      <MobileNav />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Navigation Rail on Desktop matching approved design */}
        <Sidebar />

        {/* Main Center + Right Area */}
        <div className="flex-1 w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
