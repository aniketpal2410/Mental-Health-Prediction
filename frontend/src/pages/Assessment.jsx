import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { ProgressSteps } from '../components/ProgressSteps';
import { FormField } from '../components/FormField';
import { SelectField } from '../components/SelectField';
import { GenderSelector } from '../components/GenderSelector';
import { StressSelector } from '../components/StressSelector';
import { LoadingScreen } from '../components/LoadingScreen';
import { COUNTRY_OPTIONS, submitPrediction } from '../services/api';
import assessmentPanelImg from '../assets/assessment-panel.png';
import { ArrowLeft, ArrowRight, AlertCircle, Shield } from 'lucide-react';

const ACADEMIC_OPTIONS = [
  'High School', 'Undergraduate', 'Graduate'
];

const PLATFORM_OPTIONS = [
  'Instagram', 'YouTube', 'TikTok', 'WhatsApp', 'Facebook', 
  'Twitter', 'LinkedIn', 'Snapchat', 'WeChat', 'LINE', 
  'KakaoTalk', 'VKontakte'
];

const PURPOSE_OPTIONS = [
  'Entertainment', 'Education', 'Networking', 'News'
];

export function Assessment({ onSaveResult }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // 12 ML features + optional display name
  const [formData, setFormData] = useState({
    name: '',
    Age: 21,
    Gender: 'Male',
    Grouped_Country: 'India',
    Academic_Level: 'Undergraduate',
    Most_Used_Platform: 'Instagram',
    Purpose_Of_Use: 'Entertainment',
    Avg_Daily_Usage_Hours: 4.5,
    Daily_Unlocks: 65,
    Study_Hours: 4.0,
    Physical_Activity_Hours: 1.5,
    Sleep_Hours_Per_Night: 7.0,
    Stress_Level: 'Medium',
  });

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (stepNumber) => {
    const errs = {};

    if (stepNumber === 1) {
      if (!formData.Age || isNaN(formData.Age) || formData.Age < 10 || formData.Age > 100) {
        errs.Age = 'Please enter a valid age (10–100).';
      }
      if (!formData.Gender) {
        errs.Gender = 'Select your gender.';
      }
      if (!formData.Grouped_Country) {
        errs.Grouped_Country = 'Select your country.';
      }
      if (!formData.Academic_Level) {
        errs.Academic_Level = 'Select academic level.';
      }
      if (!formData.Most_Used_Platform) {
        errs.Most_Used_Platform = 'Select most used platform.';
      }
      if (!formData.Purpose_Of_Use) {
        errs.Purpose_Of_Use = 'Select purpose of use.';
      }
    }

    if (stepNumber === 2) {
      if (formData.Avg_Daily_Usage_Hours < 0 || formData.Avg_Daily_Usage_Hours > 24) {
        errs.Avg_Daily_Usage_Hours = 'Usage hours must be between 0 and 24.';
      }
      if (formData.Study_Hours < 0 || formData.Study_Hours > 24) {
        errs.Study_Hours = 'Study hours must be between 0 and 24.';
      }
      if (formData.Daily_Unlocks < 0 || isNaN(formData.Daily_Unlocks)) {
        errs.Daily_Unlocks = 'Enter valid number of unlocks.';
      }
      if (formData.Sleep_Hours_Per_Night < 0 || formData.Sleep_Hours_Per_Night > 24) {
        errs.Sleep_Hours_Per_Night = 'Sleep hours must be between 0 and 24.';
      }
      if (formData.Physical_Activity_Hours < 0 || formData.Physical_Activity_Hours > 24) {
        errs.Physical_Activity_Hours = 'Physical activity hours must be between 0 and 24.';
      }
      if (!formData.Stress_Level) {
        errs.Stress_Level = 'Please select stress level.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 50, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await submitPrediction(formData);
      if (onSaveResult) {
        onSaveResult(result, formData);
      }
      navigate('/result', { state: { result, formData } });
    } catch (err) {
      console.error('Prediction failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the prediction server. Please verify backend is running on port 8000.'
      );
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingScreen message="Analyzing your responses with machine learning..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 select-none">
        
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 animate-fadeIn mb-4">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Prediction Request Failed</h4>
              <p className="text-xs text-rose-600 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 
          DASHBOARD SCREEN 3-COLUMN COMPOSITION:
          ┌──────────────┬──────────────────────────────┬──────────────┐
          │              │      PROGRESS BAR            │              │
          │   SIDEBAR    ├──────────────────────────────┤  DECORATIVE  │
          │              │        FORM CARD             │     PANEL    │
          └──────────────┴──────────────────────────────┴──────────────┘
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Center Column: Progress Bar + Form Card */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Top Stepper spanning center column */}
            <ProgressSteps
              currentStep={currentStep}
              onStepClick={(num) => {
                if (num < currentStep) setCurrentStep(num);
                else if (num === currentStep + 1 && validateStep(currentStep)) setCurrentStep(num);
              }}
            />

            {/* Main White Form Card matching 02-assessment.png */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 shadow-sm border border-blue-100/60 text-left min-h-[440px] flex flex-col justify-between">
              
              {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-black text-[#10244A] tracking-tight">
                      Personal Information
                    </h2>
                    <p className="text-xs text-[#6B7C96] mt-0.5 font-normal">
                      Let&apos;s start with some basic details about you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <FormField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Enter your name"
                      iconName="user"
                      error={errors.name}
                    />

                    {/* Age */}
                    <FormField
                      label="Age"
                      name="Age"
                      type="number"
                      min={10}
                      max={100}
                      value={formData.Age}
                      onChange={(e) => handleFieldChange('Age', e.target.value)}
                      placeholder="Enter age"
                      required
                      iconName="calendar"
                      error={errors.Age}
                    />

                    {/* Gender Selector: Male / Female / Others */}
                    <div className="sm:col-span-2">
                      <GenderSelector
                        value={formData.Gender}
                        onChange={(val) => handleFieldChange('Gender', val)}
                        error={errors.Gender}
                      />
                    </div>

                    {/* Country (Searchable Select) */}
                    <div className="sm:col-span-2">
                      <SelectField
                        label="Country"
                        name="Grouped_Country"
                        value={formData.Grouped_Country}
                        onChange={(e) => handleFieldChange('Grouped_Country', e.target.value)}
                        options={COUNTRY_OPTIONS}
                        placeholder="Select your country"
                        required
                        searchable
                        iconName="globe"
                        error={errors.Grouped_Country}
                      />
                    </div>

                    {/* Academic Level */}
                    <div>
                      <SelectField
                        label="Academic Level"
                        name="Academic_Level"
                        value={formData.Academic_Level}
                        onChange={(e) => handleFieldChange('Academic_Level', e.target.value)}
                        options={ACADEMIC_OPTIONS}
                        placeholder="Select academic level"
                        required
                        iconName="academic"
                        error={errors.Academic_Level}
                      />
                    </div>

                    {/* Most Used Platform */}
                    <div>
                      <SelectField
                        label="Most Used Platform"
                        name="Most_Used_Platform"
                        value={formData.Most_Used_Platform}
                        onChange={(e) => handleFieldChange('Most_Used_Platform', e.target.value)}
                        options={PLATFORM_OPTIONS}
                        placeholder="Select platform"
                        required
                        iconName="platform"
                        error={errors.Most_Used_Platform}
                      />
                    </div>

                    {/* Purpose Of Use */}
                    <div className="sm:col-span-2">
                      <SelectField
                        label="Purpose Of Use"
                        name="Purpose_Of_Use"
                        value={formData.Purpose_Of_Use}
                        onChange={(e) => handleFieldChange('Purpose_Of_Use', e.target.value)}
                        options={PURPOSE_OPTIONS}
                        placeholder="Select purpose"
                        required
                        iconName="purpose"
                        error={errors.Purpose_Of_Use}
                      />
                    </div>

                  </div>

                  {/* Next button matching 02-assessment.png */}
                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-[#1769E8] hover:bg-[#1255C0] text-white px-8 py-2.5 rounded-full text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: LIFESTYLE & DAILY HABITS ================= */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-black text-[#10244A] tracking-tight">
                      Lifestyle & Daily Habits
                    </h2>
                    <p className="text-xs text-[#6B7C96] mt-0.5 font-normal">
                      Tell us about your daily routines, screen time, and sleep.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Average Daily Usage Hours */}
                    <FormField
                      label="Average Daily Usage Hours"
                      name="Avg_Daily_Usage_Hours"
                      type="number"
                      step="0.5"
                      min={0}
                      max={24}
                      value={formData.Avg_Daily_Usage_Hours}
                      onChange={(e) => handleFieldChange('Avg_Daily_Usage_Hours', e.target.value)}
                      placeholder="Enter hours"
                      required
                      iconName="clock"
                      error={errors.Avg_Daily_Usage_Hours}
                    />

                    {/* Study Hours */}
                    <FormField
                      label="Study Hours"
                      name="Study_Hours"
                      type="number"
                      step="0.5"
                      min={0}
                      max={24}
                      value={formData.Study_Hours}
                      onChange={(e) => handleFieldChange('Study_Hours', e.target.value)}
                      placeholder="Enter hours"
                      required
                      iconName="book"
                      error={errors.Study_Hours}
                    />

                    {/* Daily Unlocks */}
                    <FormField
                      label="Daily Unlocks"
                      name="Daily_Unlocks"
                      type="number"
                      min={0}
                      max={500}
                      value={formData.Daily_Unlocks}
                      onChange={(e) => handleFieldChange('Daily_Unlocks', e.target.value)}
                      placeholder="Enter number of unlocks"
                      required
                      iconName="phone"
                      error={errors.Daily_Unlocks}
                    />

                    {/* Sleep Hours Per Night */}
                    <FormField
                      label="Sleep Hours Per Night"
                      name="Sleep_Hours_Per_Night"
                      type="number"
                      step="0.5"
                      min={0}
                      max={24}
                      value={formData.Sleep_Hours_Per_Night}
                      onChange={(e) => handleFieldChange('Sleep_Hours_Per_Night', e.target.value)}
                      placeholder="Enter hours"
                      required
                      iconName="moon"
                      error={errors.Sleep_Hours_Per_Night}
                    />

                    {/* Physical Activity Hours */}
                    <div className="sm:col-span-2">
                      <FormField
                        label="Physical Activity Hours"
                        name="Physical_Activity_Hours"
                        type="number"
                        step="0.25"
                        min={0}
                        max={24}
                        value={formData.Physical_Activity_Hours}
                        onChange={(e) => handleFieldChange('Physical_Activity_Hours', e.target.value)}
                        placeholder="Enter hours"
                        required
                        iconName="activity"
                        error={errors.Physical_Activity_Hours}
                      />
                    </div>

                    {/* Stress Level Selectable Cards: Low, Medium, High, Very High */}
                    <div className="sm:col-span-2">
                      <StressSelector
                        value={formData.Stress_Level}
                        onChange={(val) => handleFieldChange('Stress_Level', val)}
                        error={errors.Stress_Level}
                      />
                    </div>

                  </div>

                  {/* Nav buttons */}
                  <div className="flex items-center justify-between gap-2.5 pt-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="border-2 border-[#1769E8] text-[#1769E8] hover:bg-blue-50 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-[#1769E8] hover:bg-[#1255C0] text-white px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: ACADEMIC & USAGE SUMMARY ================= */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-black text-[#10244A] tracking-tight">
                      Academic & Usage Overview
                    </h2>
                    <p className="text-xs text-[#6B7C96] mt-0.5 font-normal">
                      Review your balance of screen time, study, and physical exercise.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Screen Exposure</span>
                      <p className="text-base font-bold text-blue-900">{formData.Avg_Daily_Usage_Hours} hours/day</p>
                      <p className="text-[11px] text-slate-500">{formData.Most_Used_Platform} ({formData.Purpose_Of_Use})</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone Unlocks</span>
                      <p className="text-base font-bold text-sky-900">{formData.Daily_Unlocks} unlocks/day</p>
                      <p className="text-[11px] text-slate-500">Frequency of digital check-ins</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Study Intensity</span>
                      <p className="text-base font-bold text-indigo-900">{formData.Study_Hours} hours/day</p>
                      <p className="text-[11px] text-slate-500">Level: {formData.Academic_Level}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sleep & Recovery</span>
                      <p className="text-base font-bold text-emerald-900">{formData.Sleep_Hours_Per_Night} hours/night</p>
                      <p className="text-[11px] text-slate-500">Physical activity: {formData.Physical_Activity_Hours} hrs/day</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2.5 pt-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="border-2 border-[#1769E8] text-[#1769E8] hover:bg-blue-50 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-[#1769E8] hover:bg-[#1255C0] text-white px-5 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <span>Proceed to Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: REVIEW & SUBMIT ================= */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-black text-[#10244A] tracking-tight">
                      Submit Assessment
                    </h2>
                    <p className="text-xs text-[#6B7C96] mt-0.5 font-normal">
                      Confirm your details to generate your machine learning prediction score.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-left">
                    <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Summary of Entered Inputs
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Demographics</span>
                        <span className="font-bold text-slate-800">{formData.Age} yrs • {formData.Gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Country</span>
                        <span className="font-bold text-slate-800">{formData.Grouped_Country}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Academic Level</span>
                        <span className="font-bold text-slate-800">{formData.Academic_Level}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Screen Usage</span>
                        <span className="font-bold text-slate-800">{formData.Avg_Daily_Usage_Hours} hrs/day</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Daily Unlocks</span>
                        <span className="font-bold text-slate-800">{formData.Daily_Unlocks} times</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Daily Study</span>
                        <span className="font-bold text-slate-800">{formData.Study_Hours} hrs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Sleep per Night</span>
                        <span className="font-bold text-slate-800">{formData.Sleep_Hours_Per_Night} hrs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Activity</span>
                        <span className="font-bold text-slate-800">{formData.Physical_Activity_Hours} hrs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Perceived Stress</span>
                        <span className="font-bold text-slate-800">{formData.Stress_Level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start space-x-2.5 text-blue-900 text-xs leading-relaxed text-left">
                    <Shield className="w-4 h-4 text-[#1769E8] shrink-0 mt-0.5" />
                    <p>
                      Evaluated on-demand with trained RandomForestRegressor. No data stored remotely.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="border-2 border-[#1769E8] text-[#1769E8] hover:bg-blue-50 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-[#1769E8] hover:bg-[#1255C0] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 cursor-pointer shadow-md shadow-blue-500/25 transition-all"
                    >
                      <span>Generate Prediction →</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Decorative Panel matching 02-assessment.png (moved below form card on mobile) */}
          <div className="lg:col-span-4 block mt-2 lg:mt-0">
            <div className="w-full h-44 sm:h-56 lg:h-full lg:min-h-[480px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm border border-white/80">
              <img 
                src={assessmentPanelImg} 
                alt="Small Steps Big Changes - Your mental health is a priority, not a luxury." 
                className="w-full h-full object-cover block select-none"
              />
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
