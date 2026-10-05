import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Gauge, ShieldCheck } from 'lucide-react';
import heroArtImg from '../assets/hero-art.png';
import homeTopLeaves from '../assets/home-top-leaves.png';
import homeBottomLeaves from '../assets/home-bottom-leaves.png';

export function Home() {
  return (
    <div className="relative w-full max-w-[1360px] mx-auto min-h-[calc(100vh-100px)] flex flex-col justify-center px-4 sm:px-8 py-4 select-none animate-fadeIn overflow-hidden">
      
      {/* Decorative foliage accents on the far left edge */}
      <img
        src={homeTopLeaves}
        alt=""
        aria-hidden="true"
        className="absolute top-12 left-0 w-8 sm:w-16 opacity-30 sm:opacity-85 pointer-events-none z-0"
      />
      <img
        src={homeBottomLeaves}
        alt=""
        aria-hidden="true"
        className="absolute bottom-6 left-0 w-10 sm:w-20 opacity-30 sm:opacity-90 pointer-events-none z-0"
      />

      {/* Main Two-Column Hero Grid matching 01-home.png */}
      <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
        
        {/* Left Column */}
        <div className="lg:col-span-6 min-w-0 space-y-6 sm:space-y-7 text-left pl-0 sm:pl-6">
          
          {/* Main Headline: "Your Mental \n Health Matters" */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-[#10244A] tracking-tight leading-[1.12]">
            Your Mental <br />
            Health <span className="text-[#1769E8]">Matters</span>
          </h1>

          {/* Subtitle Paragraph directly below */}
          <p className="text-[15px] sm:text-base text-[#4A5E7D] leading-relaxed max-w-lg font-normal">
            Take a step towards a healthier, happier you. 
            Our AI-powered model predicts your mental health status based on your lifestyle and academic factors.
          </p>

          {/* Exactly 3 Feature Rows matching 01-home.png */}
          <div className="space-y-4 pt-1 max-w-md">
            
            {/* Feature 1: Personalized Prediction */}
            <div className="flex items-start space-x-3.5 group">
              <div className="w-11 h-11 rounded-full bg-[#E5F1FF] flex items-center justify-center text-[#1769E8] shrink-0 transition-transform group-hover:scale-105">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-bold text-[#10244A]">
                  Personalized Prediction
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6B7C96]">
                  Get instant mental health insights
                </p>
              </div>
            </div>

            {/* Feature 2: Data Driven */}
            <div className="flex items-start space-x-3.5 group">
              <div className="w-11 h-11 rounded-full bg-[#E5F1FF] flex items-center justify-center text-[#1769E8] shrink-0 transition-transform group-hover:scale-105">
                <Gauge className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-bold text-[#10244A]">
                  Data Driven
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6B7C96]">
                  Based on machine learning
                </p>
              </div>
            </div>

            {/* Feature 3: Private & Secure */}
            <div className="flex items-start space-x-3.5 group">
              <div className="w-11 h-11 rounded-full bg-[#E5F1FF] flex items-center justify-center text-[#1769E8] shrink-0 transition-transform group-hover:scale-105">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-bold text-[#10244A]">
                  Private & Secure
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6B7C96]">
                  Your data stays confidential
                </p>
              </div>
            </div>

          </div>

          {/* Button: "Start Assessment  →" */}
          <div className="pt-2">
            <Link
              to="/assessment"
              className="w-full sm:w-auto bg-[#1769E8] hover:bg-[#1255C0] text-white px-8 py-3.5 rounded-full text-base font-bold inline-flex items-center justify-center space-x-3 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>

        {/* Right Column: Exact High-Fidelity Scenic Illustration Artwork */}
        <div className="lg:col-span-6 min-w-0 flex justify-center items-center mt-2 lg:mt-0">
          <div className="relative w-full max-w-full sm:max-w-[480px] rounded-[32px] overflow-hidden shadow-lg border border-white/80">
            <img 
              src={heroArtImg} 
              alt="Better Mind Brighter Tomorrow - Scenic nature reflection"
              className="w-full max-w-full h-auto object-contain block select-none" 
            />
          </div>
        </div>

      </div>

    </div>
  );
}
