import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { getHistory, deleteResult } from '../services/api';
import { getVisitorId } from '../utils/visitor';
import { 
  Calendar, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

function formatDateTime(dateStr) {
  try {
    const d = new Date(dateStr);
    const datePart = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const timePart = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  } catch {
    return dateStr;
  }
}

export function History() {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const visitorId = getVisitorId();

  const loadHistory = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getHistory(visitorId);
      setHistoryList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setErrorMessage('Unable to load your history. Please ensure the backend and database are reachable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [visitorId]);

  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to remove this prediction from your history?')) {
      return;
    }
    setDeletingId(resultId);
    try {
      await deleteResult(resultId, visitorId);
      setHistoryList(prev => prev.filter(item => item.id !== resultId));
    } catch (err) {
      console.error('Failed to delete result:', err);
      alert('Unable to delete this result. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (item) => {
    // Navigate to /result with saved historical data
    navigate('/result', {
      state: {
        result: {
          id: item.id,
          predicted_score: item.mental_health_score,
          mental_health_score: item.mental_health_score,
          risk_level: item.risk_level,
          status_title: item.status_title,
          result_message: item.result_message,
        },
        formData: {
          name: item.name,
          Age: item.age ?? 21,
          Gender: item.gender ?? 'Male',
          Grouped_Country: item.grouped_country ?? 'India',
          Academic_Level: item.academic_level ?? 'Undergraduate',
          Most_Used_Platform: item.most_used_platform ?? 'Instagram',
          Purpose_Of_Use: item.purpose_of_use ?? 'Entertainment',
          Avg_Daily_Usage_Hours: item.avg_daily_usage_hours ?? 4.0,
          Daily_Unlocks: item.daily_unlocks ?? 60,
          Study_Hours: item.study_hours ?? 4.0,
          Physical_Activity_Hours: item.physical_activity_hours ?? 1.5,
          Sleep_Hours_Per_Night: item.sleep_hours_per_night ?? 7.0,
          Stress_Level: item.stress_level ?? 'Medium',
        },
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto text-left select-none animate-fadeIn">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10244A] tracking-tight">
              Prediction History
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7C96] mt-0.5 font-normal">
              Your saved mental health predictions.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#6B7C96] bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-full w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1769E8]" />
            <span>Private browser storage</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 text-xs leading-relaxed animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-[28px] p-12 text-center border border-blue-100/60 shadow-xs flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#1769E8] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#6B7C96] font-medium">Loading your saved history...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !errorMessage && historyList.length === 0 && (
          <div className="bg-white rounded-[28px] p-10 sm:p-14 text-center border border-blue-100/60 shadow-xs space-y-5">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-[#1769E8]">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-[#10244A]">
                No saved predictions yet.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7C96] leading-relaxed">
                Complete an assessment and save your result to see it here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/assessment')}
              className="bg-[#1769E8] hover:bg-[#1255C0] text-white px-8 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* History Cards List (Newest First) */}
        {!isLoading && historyList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyList.map((item) => {
              const scoreNum = typeof item.mental_health_score === 'number' 
                ? item.mental_health_score.toFixed(2) 
                : item.mental_health_score;

              const isLow = item.risk_level === 'Low';
              const isMod = item.risk_level === 'Moderate';

              const riskBadgeColor = isLow
                ? 'bg-blue-50 text-[#1769E8] border-blue-200'
                : isMod
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[24px] p-4 sm:p-6 shadow-xs border border-blue-100/70 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Row: Name & Date */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-extrabold text-[#10244A] tracking-tight">
                          {item.name ? item.name : 'Personal Assessment'}
                        </h3>
                        <p className="text-[11px] text-[#8FA1B8] font-medium flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatDateTime(item.created_at)}</span>
                        </p>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${riskBadgeColor}`}>
                        {item.risk_level} Risk
                      </span>
                    </div>

                    {/* Score & Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] rounded-2xl p-3 border border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Mental Health Score
                        </span>
                        <span className="text-xl font-extrabold text-[#10244A] tracking-tight">
                          {scoreNum}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Balance Status
                        </span>
                        <span className="text-xs font-bold text-[#10244A] truncate block mt-1">
                          {item.status_title || 'Evaluated'}
                        </span>
                      </div>
                    </div>

                    {/* Result headline summary */}
                    {item.result_message && (
                      <p className="text-[11px] text-[#4A5E7D] line-clamp-2 leading-relaxed">
                        {item.result_message}
                      </p>
                    )}
                  </div>

                  {/* Actions: View Result & Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleView(item)}
                      className="border border-[#1769E8] text-[#1769E8] hover:bg-blue-50 px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Result</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
