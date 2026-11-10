/**
 * MindCare API Client
 * Primary: /api (proxied by Vite to http://127.0.0.1:8000)
 * Fallback: http://localhost:8000/api (direct CORS connection)
 */



const configuredApiUrl = import.meta.env.VITE_API_URL
  ?.replace(/\/+$/, "");

// Backend base URL
// Production: https://mental-health-api-ewd1.onrender.com/api
// Development: /api
let activeBase = configuredApiUrl
  ? `${configuredApiUrl}/api`
  : "/api";

/**
 * Fetch API with local development fallback
 */
async function fetchWithFallback(endpoint, options = {}) {
  try {
    const response = await fetch(`${activeBase}${endpoint}`, options);
    return response;

  } catch (primaryErr) {

    // Localhost fallback is ONLY for local development
    if (!import.meta.env.VITE_API_URL && activeBase === "/api") {
      try {
        const fallbackBase = "http://localhost:8000/api";

        const response = await fetch(
          `${fallbackBase}${endpoint}`,
          options
        );

        activeBase = fallbackBase;
        return response;

      } catch {
        throw primaryErr;
      }
    }

    throw primaryErr;
  }
}

/**
 * Health Check
 * GET /api/health
 */
export async function getHealthStatus() {
  try {
    const res = await fetchWithFallback("/health", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Health check failed: HTTP ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.warn("API health check error:", err);

    return {
      status: "offline",
      model_loaded: false,
      error: err.message,
    };
  }
}

/**
 * Get Model Metadata
 * GET /api/model-info
 */
export async function getModelInfo() {
  try {
    const res = await fetchWithFallback("/model-info", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Model info failed: HTTP ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Failed to get model info:", err);
    throw err;
  }
}

/**
 * Mental Health Prediction
 * POST /api/predict
 *
 * Input: All 12 required ML features
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

  const res = await fetchWithFallback("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorDetail = `Server error (HTTP ${res.status})`;

    try {
      const errorJson = await res.json();

      if (errorJson.detail) {
        errorDetail =
          typeof errorJson.detail === "string"
            ? errorJson.detail
            : JSON.stringify(errorJson.detail);
      }
    } catch {
      // Response was not valid JSON
    }

    throw new Error(errorDetail);
  }

  return await res.json();
}
