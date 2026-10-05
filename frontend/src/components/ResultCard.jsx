import React, { useState } from 'react';
import moodFaceImg from '../assets/mood-face.png';
import { saveResult } from '../services/api';
import { getVisitorId } from '../utils/visitor';

export function ResultCard({ result, formData, onRetake }) {
  // If result was loaded from history, it already has an id and is saved
  const alreadySaved = Boolean(result?.id);
  const [isSaved, setIsSaved] = useState(alreadySaved);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Predicted score from backend
  const score = result?.mental_health_score ?? result?.predicted_score ?? 7.50;

  // Use interpretation provided by backend API
  const riskLevel = result?.risk_level || (score >= 7.2 ? 'Low' : score >= 5.3 ? 'Moderate' : 'High');
  const title = result?.status_title || (
    riskLevel === 'Low' 
      ? 'Healthy Mental Balance' 
      : riskLevel === 'Moderate' 
      ? 'Moderate Mental Balance' 
      : 'Elevated Digital Strain'
  );
  const message = result?.result_message || result?.message || (
    riskLevel === 'Low'
      ? 'Your daily lifestyle habits and recovery indicators look very positive!\nKeep maintaining a balanced lifestyle with regular sleep and exercise.'
      : riskLevel === 'Moderate'
      ? 'Your daily habits are fairly balanced, with opportunities\nto improve your sleep, daily screen breaks, and study routine.'
      : 'Your inputs indicate significant screen strain and reduced recovery.\nPrioritize restful sleep, physical activity, and healthy digital boundaries.'
  );

  let bannerBg = 'bg-[#EAF8F1]';
  let riskColor = 'text-[#1769E8]'; // vibrant blue matching 03-result.png
  if (riskLevel === 'Moderate') {
    bannerBg = 'bg-[#FEF7EC]';
    riskColor = 'text-[#D97706]';
  } else if (riskLevel === 'High') {
    bannerBg = 'bg-[#FEECEC]';
    riskColor = 'text-[#E11D48]';
  }

  // Key factors dynamic based on profile
  const sleepVal = formData?.Sleep_Hours_Per_Night ?? formData?.sleep_hours_per_night;
  const studyVal = formData?.Study_Hours ?? formData?.study_hours;
  const usageVal = formData?.Avg_Daily_Usage_Hours ?? formData?.avg_daily_usage_hours;
  const unlocksVal = formData?.Daily_Unlocks ?? formData?.daily_unlocks;
  const stressVal = formData?.Stress_Level ?? formData?.stress_level;

  const keyFactors = riskLevel === 'High' ? [
    { text: usageVal ? `${usageVal}h high screen time` : 'Elevated screen usage' },
    { text: sleepVal ? `${sleepVal}h limited sleep` : 'Insufficient rest' },
    { text: stressVal ? `${stressVal} perceived stress` : 'High digital strain' },
  ] : riskLevel === 'Moderate' ? [
    { text: sleepVal ? `${sleepVal}h sleep per night` : 'Sleep schedule' },
    { text: usageVal ? `${usageVal}h daily screen time` : 'Moderate screen time' },
    { text: unlocksVal ? `${unlocksVal} daily phone unlocks` : 'Digital check-in rate' },
  ] : [
    { text: sleepVal ? `${sleepVal}h restful sleep routine` : 'Good sleep routine' },
    { text: studyVal ? `${studyVal}h regular study hours` : 'Regular study hours' },
    { text: usageVal ? `${usageVal}h moderate screen time` : 'Moderate screen time' },
  ];

  // Recommendations dynamic based on profile
  const recommendations = riskLevel === 'High' ? [
    { text: 'Prioritize 7-8 hours nightly rest' },
    { text: 'Set screen-free downtime before bed' },
    { text: 'Engage in daily physical movement' },
  ] : riskLevel === 'Moderate' ? [
    { text: 'Aim for consistent sleep schedule' },
    { text: 'Take short breaks every 45 mins' },
    { text: 'Increase daily physical activity' },
  ] : [
    { text: 'Maintain your current routine' },
    { text: 'Stay physically active' },
    { text: 'Practice daily mindfulness' },
  ];

  const handleSave = async () => {
    if (isSaved || isSaving) return;

    if (score === undefined || score === null) {
      setSaveStatus('No prediction result to save.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('Saving your result...');

    try {
      const visitorId = getVisitorId();
      await saveResult({
        visitor_id: visitorId,
        name: formData?.name || null,
        Age: formData?.Age ?? formData?.age ?? 21,
        Gender: formData?.Gender ?? formData?.gender ?? 'Male',
        Grouped_Country: formData?.Grouped_Country ?? formData?.grouped_country ?? 'India',
        Academic_Level: formData?.Academic_Level ?? formData?.academic_level ?? 'Undergraduate',
        Most_Used_Platform: formData?.Most_Used_Platform ?? formData?.most_used_platform ?? 'Instagram',
        Purpose_Of_Use: formData?.Purpose_Of_Use ?? formData?.purpose_of_use ?? 'Entertainment',
        Avg_Daily_Usage_Hours: formData?.Avg_Daily_Usage_Hours ?? formData?.avg_daily_usage_hours ?? 4.5,
        Daily_Unlocks: formData?.Daily_Unlocks ?? formData?.daily_unlocks ?? 65,
        Study_Hours: formData?.Study_Hours ?? formData?.study_hours ?? 4.0,
        Physical_Activity_Hours: formData?.Physical_Activity_Hours ?? formData?.physical_activity_hours ?? 1.5,
        Sleep_Hours_Per_Night: formData?.Sleep_Hours_Per_Night ?? formData?.sleep_hours_per_night ?? 7.0,
        Stress_Level: formData?.Stress_Level ?? formData?.stress_level ?? 'Medium',
        mental_health_score: score,
        risk_level: riskLevel,
        status_title: title,
        result_message: message,
      });

      setIsSaved(true);
      setSaveStatus('Your result has been saved.');
    } catch (err) {
      console.error('Failed to save result:', err);
      setSaveStatus('Unable to save your result. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayScore = typeof score === 'number' ? score.toFixed(2) : score;

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 shadow-sm border border-blue-100/60 space-y-5 max-w-2xl mx-auto text-left select-none animate-fadeIn">
      
      {/* Title & Subtitle matching 03-result.png */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#10244A] tracking-tight">
            Prediction Result
          </h1>
          <p className="text-xs text-[#6B7C96] mt-0.5 font-normal">
            Here is the analysis based on your inputs.
          </p>
        </div>
        {alreadySaved && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
            Saved Record
          </span>
        )}
      </div>

      {/* Result Panel matching 03-result.png */}
      <div className={`p-5 sm:p-6 rounded-2xl ${bannerBg} flex flex-col items-center text-center space-y-2.5`}>
        <img 
          src={moodFaceImg} 
          alt="Serene mood face" 
          className="w-14 h-14 object-contain rounded-full shadow-xs" 
        />

        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-[#10244A]">
            {title}
          </h2>
          <p className="text-xs text-[#4A5E7D] max-w-sm mx-auto leading-relaxed whitespace-pre-line font-normal">
            {message}
          </p>
        </div>
      </div>

      {/* Two Metric Cards matching 03-result.png: Stacks on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Metric 1: Mental Health Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100/70 text-center flex flex-col items-center justify-center space-y-0.5 shadow-xs">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#10244A] tracking-tight">
            {displayScore}
          </span>
          <span className="text-xs font-semibold text-[#4A5E7D]">
            Mental Health Score
          </span>
        </div>

        {/* Metric 2: Risk Level */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100/70 text-center flex flex-col items-center justify-center space-y-0.5 shadow-xs">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${riskColor}`}>
            {riskLevel}
          </span>
          <span className="text-xs font-semibold text-[#4A5E7D]">
            Risk Level
          </span>
        </div>
      </div>

      {/* Two Lower Detail Areas: Key Factors & Recommendations (Stacks on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
        {/* Key Factors */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100/70 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-[#10244A]">
            Key Factors
          </h3>
          <ul className="space-y-2">
            {keyFactors.map((f, i) => (
              <li key={i} className="flex items-center space-x-2 text-xs text-[#4A5E7D]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100/70 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-[#10244A]">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-center space-x-2 text-xs text-[#4A5E7D]">
                <span className="w-2 h-2 rounded-full bg-[#1769E8] shrink-0" />
                <span>{rec.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Save Status Notification Banner */}
      {saveStatus && (
        <div className={`p-2.5 rounded-xl text-xs font-medium text-center animate-fadeIn ${
          isSaved
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : isSaving
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {saveStatus}
        </div>
      )}

      {/* Action buttons matching 03-result.png: Save Result & Try Again */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className={`w-full sm:w-auto border-2 px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
            isSaved
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 cursor-default opacity-90'
              : isSaving
              ? 'border-blue-300 text-blue-400 bg-blue-50/50 cursor-wait'
              : 'border-[#1769E8] text-[#1769E8] hover:bg-blue-50 cursor-pointer shadow-xs'
          }`}
        >
          <span>{isSaved ? '✓ Saved' : isSaving ? 'Saving...' : 'Save Result'}</span>
        </button>

        <button
          type="button"
          onClick={onRetake}
          className="w-full sm:w-auto bg-[#1769E8] hover:bg-[#1255C0] text-white px-9 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <span>Try Again</span>
        </button>
      </div>

    </div>
  );
}
