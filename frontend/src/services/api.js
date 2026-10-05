/**
 * MindCare API Service
 * Interacts with FastAPI backend using VITE_API_URL or defaults to /api proxy
 */

let activeBaseUrl = import.meta.env.VITE_API_URL || '/api';

/**
 * Robust fetch wrapper that falls back to direct backend URL if proxy fails
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${activeBaseUrl}${endpoint}`, options);
    if (res.ok || res.status === 422 || res.status === 404) {
      return res;
    }
  } catch (err) {
    if (activeBaseUrl === '/api') {
      try {
        const directUrl = 'http://localhost:8000/api';
        const res2 = await fetch(`${directUrl}${endpoint}`, options);
        if (res2.ok || res2.status === 422 || res2.status === 404) {
          activeBaseUrl = directUrl;
          return res2;
        }
      } catch {
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Health check
 */
export async function checkApiHealth() {
  try {
    const res = await apiFetch('/health', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res || !res.ok) {
      return { status: 'offline', model_loaded: false, database_connected: false };
    }
    return await res.json();
  } catch (error) {
    console.warn('Health check failed:', error);
    return { status: 'offline', model_loaded: false, database_connected: false, error: error.message };
  }
}

/**
 * Fetch model information & supported categories
 */
export async function fetchModelInfo() {
  try {
    const res = await apiFetch('/model-info', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res || !res.ok) {
      throw new Error(`Failed to load model info: status ${res?.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching model info:', error);
    throw error;
  }
}

/**
 * Country mapper: User selects friendly country name,
 * maps to the Grouped_Country expected by the model.
 */
export const COUNTRY_OPTIONS = [
  { label: 'India', value: 'India' },
  { label: 'United States (USA)', value: 'USA' },
  { label: 'United Kingdom (UK)', value: 'UK' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Brazil', value: 'Other' },
  { label: 'Japan', value: 'Other' },
  { label: 'South Korea', value: 'Other' },
  { label: 'Spain', value: 'Other' },
  { label: 'Italy', value: 'Other' },
  { label: 'China', value: 'Other' },
  { label: 'Indonesia', value: 'Other' },
  { label: 'Nigeria', value: 'Other' },
  { label: 'Other Country', value: 'Other' },
];

/**
 * Submit prediction request to FastAPI /api/predict
 */
export async function predictMentalHealth(formData) {
  let cleanGender = formData.Gender;
  if (cleanGender === 'Others') {
    cleanGender = 'Female'; // fallback default for binary training set
  }

  const payload = {
    Age: parseInt(formData.Age, 10),
    Gender: cleanGender,
    Grouped_Country: formData.Grouped_Country,
    Academic_Level: formData.Academic_Level,
    Most_Used_Platform: formData.Most_Used_Platform,
    Purpose_Of_Use: formData.Purpose_Of_Use,
    Avg_Daily_Usage_Hours: parseFloat(formData.Avg_Daily_Usage_Hours),
    Daily_Unlocks: parseInt(formData.Daily_Unlocks, 10),
    Study_Hours: parseFloat(formData.Study_Hours),
    Physical_Activity_Hours: parseFloat(formData.Physical_Activity_Hours),
    Sleep_Hours_Per_Night: parseFloat(formData.Sleep_Hours_Per_Night),
    Stress_Level: formData.Stress_Level,
  };

  const res = await apiFetch('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res || !res.ok) {
    let errorMsg = `Server error (${res?.status || 'No Response'})`;
    try {
      const errData = await res.json();
      if (errData.detail) {
        errorMsg = typeof errData.detail === 'string'
          ? errData.detail
          : JSON.stringify(errData.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return await res.json();
}

// Backward-compatible alias
export const submitPrediction = predictMentalHealth;

/**
 * Save assessment and prediction to PostgreSQL database
 */
export async function saveResult(data) {
  let cleanGender = data.Gender || data.gender;
  if (cleanGender === 'Others') {
    cleanGender = 'Female';
  }

  const payload = {
    visitor_id: data.visitor_id,
    name: data.name || null,
    Age: parseInt(data.Age || data.age, 10),
    Gender: cleanGender,
    Grouped_Country: data.Grouped_Country || data.grouped_country,
    Academic_Level: data.Academic_Level || data.academic_level,
    Most_Used_Platform: data.Most_Used_Platform || data.most_used_platform,
    Purpose_Of_Use: data.Purpose_Of_Use || data.purpose_of_use,
    Avg_Daily_Usage_Hours: parseFloat(data.Avg_Daily_Usage_Hours ?? data.avg_daily_usage_hours),
    Daily_Unlocks: parseInt(data.Daily_Unlocks ?? data.daily_unlocks, 10),
    Study_Hours: parseFloat(data.Study_Hours ?? data.study_hours),
    Physical_Activity_Hours: parseFloat(data.Physical_Activity_Hours ?? data.physical_activity_hours),
    Sleep_Hours_Per_Night: parseFloat(data.Sleep_Hours_Per_Night ?? data.sleep_hours_per_night),
    Stress_Level: data.Stress_Level || data.stress_level,
    mental_health_score: parseFloat(data.mental_health_score ?? data.predicted_score),
    risk_level: data.risk_level,
    status_title: data.status_title,
    result_message: data.result_message || data.message,
  };

  const res = await apiFetch('/results/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res || !res.ok) {
    let errorMsg = 'Unable to save your result. Please try again.';
    try {
      const errData = await res.json();
      if (errData.detail) {
        errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return await res.json();
}

/**
 * Retrieve prediction history for a visitor
 */
export async function getHistory(visitorId) {
  const res = await apiFetch(`/results/history/${encodeURIComponent(visitorId)}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res || !res.ok) {
    throw new Error('Unable to load your history.');
  }

  return await res.json();
}

/**
 * Retrieve single prediction result by ID verifying ownership
 */
export async function getResult(resultId, visitorId) {
  const res = await apiFetch(
    `/results/${resultId}?visitor_id=${encodeURIComponent(visitorId)}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!res || !res.ok) {
    throw new Error('Unable to load saved prediction detail.');
  }

  return await res.json();
}

/**
 * Delete a prediction result by ID verifying ownership
 */
export async function deleteResult(resultId, visitorId) {
  const res = await apiFetch(
    `/results/${resultId}?visitor_id=${encodeURIComponent(visitorId)}`,
    {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!res || !res.ok) {
    throw new Error('Unable to delete result.');
  }

  return await res.json();
}
