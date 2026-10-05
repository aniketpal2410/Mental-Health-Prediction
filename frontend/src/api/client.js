/**
 * MindCare API Client
 * Primary: /api (proxied by Vite to http://127.0.0.1:8000)
 * Fallback: http://localhost:8000/api (direct CORS connection)
 */

let activeBase = import.meta.env.VITE_API_URL || '/api';

async function fetchWithFallback(endpoint, options = {}) {
  try {
    const res = await fetch(`${activeBase}${endpoint}`, options);
    if (res.ok || res.status === 422) {
      return res;
    }
  } catch (primaryErr) {
    // If relative /api failed (e.g. proxy timeout on Windows), attempt direct CORS connection
    if (activeBase === '/api') {
      try {
        const fallbackBase = 'http://localhost:8000/api';
        const res2 = await fetch(`${fallbackBase}${endpoint}`, options);
        if (res2.ok || res2.status === 422) {
          activeBase = fallbackBase; // persist working endpoint
          return res2;
        }
      } catch {
        throw primaryErr;
      }
    }
    throw primaryErr;
  }
}

/**
 * Health check
 */
export async function getHealthStatus() {
  try {
    const res = await fetchWithFallback('/health', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res || !res.ok) {
      throw new Error(`Health check returned status ${res?.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return { status: 'offline', model_loaded: false, error: err.message };
  }
}

/**
 * Get Model Metadata & Expected Categories
 */
export async function getModelInfo() {
  try {
    const res = await fetchWithFallback('/model-info', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res || !res.ok) {
      throw new Error(`Model info returned status ${res?.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to get model info:', err);
    throw err;
  }
}

/**
 * Run Mental Health Prediction with the real ML model
 * @param {Object} input - Must contain all 12 exact features
 */
export async function predictMentalHealth(input) {
  const payload = {
    Age: parseInt(input.Age, 10),
    Gender: input.Gender,
    Grouped_Country: input.Grouped_Country,
    Academic_Level: input.Academic_Level,
    Most_Used_Platform: input.Most_Used_Platform,
    Purpose_Of_Use: input.Purpose_Of_Use,
    Avg_Daily_Usage_Hours: parseFloat(input.Avg_Daily_Usage_Hours),
    Daily_Unlocks: parseInt(input.Daily_Unlocks, 10),
    Study_Hours: parseFloat(input.Study_Hours),
    Physical_Activity_Hours: parseFloat(input.Physical_Activity_Hours),
    Sleep_Hours_Per_Night: parseFloat(input.Sleep_Hours_Per_Night),
    Stress_Level: input.Stress_Level,
  };

  const res = await fetchWithFallback('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res || !res.ok) {
    let errorDetail = `Server error (${res?.status || 'No Response'})`;
    try {
      const errorJson = await res.json();
      if (errorJson.detail) {
        errorDetail = typeof errorJson.detail === 'string'
          ? errorJson.detail
          : JSON.stringify(errorJson.detail);
      }
    } catch {
      // ignore parsing failure
    }
    throw new Error(errorDetail);
  }

  return await res.json();
}
