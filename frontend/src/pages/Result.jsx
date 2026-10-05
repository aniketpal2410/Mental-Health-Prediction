import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { ResultCard } from '../components/ResultCard';

export function Result({ savedResult, savedFormData }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Default fallback if visiting /result directly without taking assessment
  const result = location.state?.result || savedResult || {
    predicted_score: 7.50,
    risk_level: 'Low',
    status_title: 'Healthy Mental Balance',
    message: 'Your daily lifestyle habits and recovery indicators look very positive!\nKeep maintaining a balanced lifestyle with regular sleep and exercise.',
  };
  const formData = location.state?.formData || savedFormData || {
    Sleep_Hours_Per_Night: 7.5,
    Study_Hours: 4.0,
    Avg_Daily_Usage_Hours: 3.5,
  };


  const handleRetake = () => {
    navigate('/assessment');
  };

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center py-2 animate-fadeIn">
        <ResultCard
          result={result}
          formData={formData}
          onRetake={handleRetake}
        />
      </div>
    </DashboardLayout>
  );
}
