/**
 * MindCare Anonymous Visitor Identification
 *
 * Persists an anonymous UUID in localStorage under 'mindcare_visitor_id'.
 * Avoids any global data leakage while isolating assessment history per browser.
 */

const STORAGE_KEY = 'mindcare_visitor_id';

export function getVisitorId() {
  try {
    let visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        visitorId = crypto.randomUUID();
      } else {
        // Fallback for older browsers
        visitorId = 'mc_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      }
      localStorage.setItem(STORAGE_KEY, visitorId);
    }
    return visitorId;
  } catch (err) {
    console.warn('localStorage not accessible, generating session ID:', err);
    return 'mc_session_' + Date.now().toString(36);
  }
}
