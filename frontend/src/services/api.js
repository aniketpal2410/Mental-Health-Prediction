
/**
 * MindCare API Service
 *
 * Production:
 * https://mental-health-api-ewd1.onrender.com/api
 *
 * Development:
 * /api (Vite proxy)
 * http://localhost:8000/api (fallback)
 */

// ==========================================
// 1. API BASE URL CONFIGURATION
// ==========================================

const configuredApiUrl = import.meta.env.VITE_API_URL
  ?.replace(/\/+$/, "");

let activeBaseUrl = configuredApiUrl
  ? `${configuredApiUrl}/api`
  : "/api";


// ==========================================
// 2. COMMON API FETCH FUNCTION
// ==========================================

async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(
      `${activeBaseUrl}${endpoint}`,
      options
    );

    return response;

  } catch (error) {

    // Localhost fallback only during development
    if (
      import.meta.env.DEV &&
      !configuredApiUrl &&
      activeBaseUrl === "/api"
    ) {
      try {
        const directUrl = "http://localhost:8000/api";

        const response = await fetch(
          `${directUrl}${endpoint}`,
          options
        );

        activeBaseUrl = directUrl;

        return response;

      } catch {
        throw error;
      }
    }

    throw error;
  }
}


// ==========================================
// 3. HEALTH CHECK
// GET /api/health
// ==========================================

export async function checkApiHealth() {
  try {
    const response = await apiFetch("/health", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Health check failed: HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {
    console.warn("Health check failed:", error);

    return {
      status: "offline",
      model_loaded: false,
      database_connected: false,
      error: error.message,
    };
  }
}


// ==========================================
// 4. MODEL INFORMATION
// GET /api/model-info
// ==========================================

export async function fetchModelInfo() {
  try {
    const response = await apiFetch("/model-info", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to load model info: HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {
    console.error("Error fetching model info:", error);
    throw error;
  }
}


// ==========================================
// 5. COUNTRY OPTIONS
// ==========================================

export const COUNTRY_OPTIONS = [
  { label: "India", value: "India" },
  { label: "United States (USA)", value: "USA" },
  { label: "United Kingdom (UK)", value: "UK" },
  { label: "Canada", value: "Canada" },
  { label: "Australia", value: "Australia" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  { label: "Mexico", value: "Mexico" },
  { label: "Turkey", value: "Turkey" },
  { label: "Brazil", value: "Other" },
  { label: "Japan", value: "Other" },
  { label: "South Korea", value: "Other" },
  { label: "Spain", value: "Other" },
  { label: "Italy", value: "Other" },
  { label: "China", value: "Other" },
  { label: "Indonesia", value: "Other" },
  { label: "Nigeria", value: "Other" },
  { label: "Other Country", value: "Other" },
];


// ==========================================
// 6. PREDICT MENTAL HEALTH
// POST /api/predict
// ==========================================

export async function predictMentalHealth(formData) {

  let cleanGender = formData.Gender;

  if (cleanGender === "Others") {
    cleanGender = "Female";
  }

  const payload = {
    Age: parseInt(formData.Age, 10),
    Gender: cleanGender,

    Grouped_Country: formData.Grouped_Country,
    Academic_Level: formData.Academic_Level,

    Most_Used_Platform: formData.Most_Used_Platform,
    Purpose_Of_Use: formData.Purpose_Of_Use,

    Avg_Daily_Usage_Hours: parseFloat(
      formData.Avg_Daily_Usage_Hours
    ),

    Daily_Unlocks: parseInt(
      formData.Daily_Unlocks,
      10
    ),

    Study_Hours: parseFloat(formData.Study_Hours),

    Physical_Activity_Hours: parseFloat(
      formData.Physical_Activity_Hours
    ),

    Sleep_Hours_Per_Night: parseFloat(
      formData.Sleep_Hours_Per_Night
    ),

    Stress_Level: formData.Stress_Level,
  };

  const response = await apiFetch("/predict", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {

    let errorMessage =
      `Server error (HTTP ${response.status})`;

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }

    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}


// Backward-compatible alias
export const submitPrediction = predictMentalHealth;


// ==========================================
// 7. SAVE ASSESSMENT RESULT
// POST /api/results/save
// ==========================================

export async function saveResult(data) {

  let cleanGender = data.Gender || data.gender;

  if (cleanGender === "Others") {
    cleanGender = "Female";
  }

  const payload = {
    visitor_id: data.visitor_id,
    name: data.name || null,

    Age: parseInt(data.Age || data.age, 10),

    Gender: cleanGender,

    Grouped_Country:
      data.Grouped_Country || data.grouped_country,

    Academic_Level:
      data.Academic_Level || data.academic_level,

    Most_Used_Platform:
      data.Most_Used_Platform || data.most_used_platform,

    Purpose_Of_Use:
      data.Purpose_Of_Use || data.purpose_of_use,

    Avg_Daily_Usage_Hours: parseFloat(
      data.Avg_Daily_Usage_Hours ??
      data.avg_daily_usage_hours
    ),

    Daily_Unlocks: parseInt(
      data.Daily_Unlocks ??
      data.daily_unlocks,
      10
    ),

    Study_Hours: parseFloat(
      data.Study_Hours ?? data.study_hours
    ),

    Physical_Activity_Hours: parseFloat(
      data.Physical_Activity_Hours ??
      data.physical_activity_hours
    ),

    Sleep_Hours_Per_Night: parseFloat(
      data.Sleep_Hours_Per_Night ??
      data.sleep_hours_per_night
    ),

    Stress_Level:
      data.Stress_Level || data.stress_level,

    mental_health_score: parseFloat(
      data.mental_health_score ??
      data.predicted_score
    ),

    risk_level: data.risk_level,
    status_title: data.status_title,

    result_message:
      data.result_message || data.message,
  };

  const response = await apiFetch("/results/save", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {

    let errorMessage =
      "Unable to save your result. Please try again.";

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }

    } catch {
      // Ignore parsing errors
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}


// ==========================================
// 8. GET PREDICTION HISTORY
// GET /api/results/history/{visitor_id}
// ==========================================

export async function getHistory(visitorId) {

  const response = await apiFetch(
    `/results/history/${encodeURIComponent(visitorId)}`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load history: HTTP ${response.status}`
    );
  }

  return await response.json();
}


// ==========================================
// 9. GET SINGLE RESULT
// GET /api/results/{result_id}
// ==========================================

export async function getResult(resultId, visitorId) {

  const response = await apiFetch(
    `/results/${encodeURIComponent(resultId)}?visitor_id=${encodeURIComponent(visitorId)}`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load saved result: HTTP ${response.status}`
    );
  }

  return await response.json();
}


// ==========================================
// 10. DELETE RESULT
// DELETE /api/results/{result_id}
// ==========================================

export async function deleteResult(resultId, visitorId) {

  const response = await apiFetch(
    `/results/${encodeURIComponent(resultId)}?visitor_id=${encodeURIComponent(visitorId)}`,
    {
      method: "DELETE",

      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to delete result: HTTP ${response.status}`
    );
  }

  return await response.json();
}
