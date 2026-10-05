"""Smoke test – hits /api/health, /api/predict, and /api/model-info
against the running FastAPI server.

Usage:
    python test_api.py            # default: http://localhost:8000
    python test_api.py http://localhost:9000   # custom base URL
"""

import json
import sys

import httpx

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"

SAMPLE_INPUT = {
    "Age": 21,
    "Gender": "Male",
    "Grouped_Country": "India",
    "Academic_Level": "Undergraduate",
    "Most_Used_Platform": "Instagram",
    "Purpose_Of_Use": "Entertainment",
    "Avg_Daily_Usage_Hours": 5.0,
    "Daily_Unlocks": 80,
    "Study_Hours": 3.0,
    "Physical_Activity_Hours": 1.5,
    "Sleep_Hours_Per_Night": 6.5,
    "Stress_Level": "Medium",
}


def _pretty(obj):
    return json.dumps(obj, indent=2)


def main():
    passed = 0
    failed = 0

    # -- 1. Health check --
    print("=" * 60)
    print("TEST 1: GET /api/health")
    print("=" * 60)
    try:
        r = httpx.get(f"{BASE}/api/health", timeout=10)
        body = r.json()
        print(f"  Status code : {r.status_code}")
        print(f"  Response    : {_pretty(body)}")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert body["status"] == "healthy"
        assert body["model_loaded"] is True
        print("  [PASS]\n")
        passed += 1
    except Exception as exc:
        print(f"  [FAIL] - {exc}\n")
        failed += 1

    # -- 2. Prediction --
    print("=" * 60)
    print("TEST 2: POST /api/predict")
    print("=" * 60)
    print(f"  Payload     : {_pretty(SAMPLE_INPUT)}")
    try:
        r = httpx.post(f"{BASE}/api/predict", json=SAMPLE_INPUT, timeout=30)
        body = r.json()
        print(f"  Status code : {r.status_code}")
        print(f"  Response    : {_pretty(body)}")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert "predicted_score" in body
        score = body["predicted_score"]
        assert isinstance(score, (int, float)), f"Score is not numeric: {score}"
        print(f"  Predicted mental health score: {score}")
        print("  [PASS]\n")
        passed += 1
    except Exception as exc:
        print(f"  [FAIL] - {exc}\n")
        failed += 1

    # -- 3. Model info --
    print("=" * 60)
    print("TEST 3: GET /api/model-info")
    print("=" * 60)
    try:
        r = httpx.get(f"{BASE}/api/model-info", timeout=10)
        body = r.json()
        print(f"  Status code : {r.status_code}")
        print(f"  Response    : {_pretty(body)}")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert body["model_type"] == "RandomForestRegressor"
        print("  [PASS]\n")
        passed += 1
    except Exception as exc:
        print(f"  [FAIL] - {exc}\n")
        failed += 1

    # -- 4. Validation error (missing field) --
    print("=" * 60)
    print("TEST 4: POST /api/predict - missing field (expect 422)")
    print("=" * 60)
    try:
        bad_input = {"Age": 21}  # missing required fields
        r = httpx.post(f"{BASE}/api/predict", json=bad_input, timeout=10)
        print(f"  Status code : {r.status_code}")
        assert r.status_code == 422, f"Expected 422, got {r.status_code}"
        print("  [PASS] (validation error returned correctly)\n")
        passed += 1
    except Exception as exc:
        print(f"  [FAIL] - {exc}\n")
        failed += 1

    # -- Summary --
    print("=" * 60)
    print(f"RESULTS: {passed} passed, {failed} failed out of {passed + failed}")
    print("=" * 60)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
