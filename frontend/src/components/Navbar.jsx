import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import logoBrainImg from '../assets/logo-brain.png';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === '/';
  const isAbout = path === '/about';
  const isHowItWorks = path === '/how-it-works';
  const isTips = path === '/tips';

  return (
    <header className="w-full bg-transparent py-3 sm:py-4 px-3 sm:px-6 select-none">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between">
        
        {/* Left: MindCare logo with tagline only on Home */}
        <Logo showTagline={isHome} />

        {/* Center Navigation Links matching reference */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
          <Link
            to="/"
            className={`text-[15px] font-semibold transition-all relative py-1 flex flex-col items-center ${
              isHome 
                ? 'text-[#1769E8] font-bold' 
                : 'text-[#4A5E7D] hover:text-[#1769E8]'
            }`}
          >
            <span>Home</span>
            {isHome && (
              <span className="h-[3px] w-9 bg-[#1769E8] rounded-full mt-1" />
            )}
          </Link>

          <Link
            to="/about"
            className={`text-[15px] font-semibold transition-all relative py-1 flex flex-col items-center ${
              isAbout 
                ? 'text-[#1769E8] font-bold' 
                : 'text-[#4A5E7D] hover:text-[#1769E8]'
            }`}
          >
            <span>About</span>
            {isAbout && (
              <span className="h-[3px] w-9 bg-[#1769E8] rounded-full mt-1" />
            )}
          </Link>

          <Link
            to="/how-it-works"
            className={`text-[15px] font-semibold transition-all relative py-1 flex flex-col items-center ${
              isHowItWorks 
                ? 'text-[#1769E8] font-bold' 
                : 'text-[#4A5E7D] hover:text-[#1769E8]'
            }`}
          >
            <span>How it Works</span>
            {isHowItWorks && (
              <span className="h-[3px] w-9 bg-[#1769E8] rounded-full mt-1" />
            )}
          </Link>

          <Link
            to="/tips"
            className={`text-[15px] font-semibold transition-all relative py-1 flex flex-col items-center ${
              isTips 
                ? 'text-[#1769E8] font-bold' 
                : 'text-[#4A5E7D] hover:text-[#1769E8]'
            }`}
          >
            <span>Tips</span>
            {isTips && (
              <span className="h-[3px] w-9 bg-[#1769E8] rounded-full mt-1" />
            )}
          </Link>
        </nav>

        {/* Right Element */}
        <div className="hidden md:flex items-center">
          {isHome ? (
            /* Solid Royal Blue Pill "Get Started" matching 01-home.png */
            <Link
              to="/assessment"
              className="bg-[#1769E8] hover:bg-[#1255C0] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Get Started
            </Link>
          ) : (
            /* Circular Brain Avatar matching 02-assessment.png */
            <Link
              to="/assessment"
              title="MindCare Profile"
              className="w-10 h-10 rounded-full border border-blue-200/90 bg-white flex items-center justify-center p-2 text-[#1769E8] hover:border-[#1769E8] hover:shadow-sm transition-all"
            >
              <img src={logoBrainImg} alt="Profile" className="w-5 h-5 object-contain" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-[#10244A] hover:text-[#1769E8] hover:bg-blue-50 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border border-blue-100 rounded-3xl mt-2 p-4 space-y-3 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isHome ? 'bg-blue-50 text-[#1769E8] font-bold' : 'text-[#4A5E7D] hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/assessment"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                path === '/assessment' ? 'bg-blue-50 text-[#1769E8] font-bold' : 'text-[#4A5E7D] hover:bg-slate-50'
              }`}
            >
              Assessment
            </Link>
            <Link
              to="/result"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                path === '/result' ? 'bg-blue-50 text-[#1769E8] font-bold' : 'text-[#4A5E7D] hover:bg-slate-50'
              }`}
            >
              Your Result
            </Link>
            <Link
              to="/history"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                path === '/history' ? 'bg-blue-50 text-[#1769E8] font-bold' : 'text-[#4A5E7D] hover:bg-slate-50'
              }`}
            >
              History
            </Link>
            <Link
              to="/tips"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isTips ? 'bg-blue-50 text-[#1769E8] font-bold' : 'text-[#4A5E7D] hover:bg-slate-50'
              }`}
            >
              Mental Health Tips
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isAbout ? 'bg-blue-50 text-[#1769E8] font-bold' : 'text-[#4A5E7D] hover:bg-slate-50'
              }`}
            >
              About
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/assessment"
              onClick={() => setMobileOpen(false)}
              className="w-full bg-[#1769E8] hover:bg-[#1255C0] text-white py-3 rounded-full text-center text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
