import urllib.request
import urllib.error
import json
import sys

BASE = 'http://localhost:8000/api'

def req(url, method='GET', data=None):
    b = json.dumps(data).encode() if data else None
    headers = {'Content-Type': 'application/json', 'Accept': 'application/json'} if data else {'Accept': 'application/json'}
    r = urllib.request.Request(url, data=b, headers=headers, method=method)
    with urllib.request.urlopen(r) as resp:
        return json.loads(resp.read().decode())

def main():
    print('=== 1. HEALTH CHECK ===')
    h = req(f'{BASE}/health')
    print('Health response:', h)
    assert h['database_connected'] is True, 'DB not connected'
    assert h['model_loaded'] is True, 'Model not loaded'

    print('\n=== 2. RUN REAL PREDICTION FOR ANIKET ===')
    p1_input = {
        'Age': 22, 'Gender': 'Male', 'Grouped_Country': 'India',
        'Academic_Level': 'Undergraduate', 'Most_Used_Platform': 'Instagram',
        'Purpose_Of_Use': 'Entertainment', 'Avg_Daily_Usage_Hours': 4.5,
        'Daily_Unlocks': 70, 'Study_Hours': 4.0, 'Physical_Activity_Hours': 1.5,
        'Sleep_Hours_Per_Night': 7.0, 'Stress_Level': 'Medium'
    }
    p1 = req(f'{BASE}/predict', 'POST', p1_input)
    print('Prediction 1 (Aniket):', p1)

    print('\n=== 3. SAVE RESULT FOR ANIKET ===')
    visitor_id = 'test-visitor-uuid-101'
    save_payload_1 = {
        'visitor_id': visitor_id,
        'name': 'Aniket',
        **p1_input,
        'mental_health_score': p1['predicted_score'],
        'risk_level': p1['risk_level'],
        'status_title': p1['status_title'],
        'result_message': p1['message']
    }
    s1 = req(f'{BASE}/results/save', 'POST', save_payload_1)
    print('Save 1 Response:', s1)
    aniket_id = s1['result_id']

    print('\n=== 4. RUN PREDICTION & SAVE FOR PRIYA (SECOND RECORD) ===')
    p2_input = {
        'Age': 24, 'Gender': 'Female', 'Grouped_Country': 'USA',
        'Academic_Level': 'Graduate', 'Most_Used_Platform': 'TikTok',
        'Purpose_Of_Use': 'Entertainment', 'Avg_Daily_Usage_Hours': 11.5,
        'Daily_Unlocks': 170, 'Study_Hours': 8.0, 'Physical_Activity_Hours': 0.5,
        'Sleep_Hours_Per_Night': 4.0, 'Stress_Level': 'High'
    }
    p2 = req(f'{BASE}/predict', 'POST', p2_input)
    print('Prediction 2 (Priya):', p2)

    save_payload_2 = {
        'visitor_id': visitor_id,
        'name': 'Priya',
        **p2_input,
        'mental_health_score': p2['predicted_score'],
        'risk_level': p2['risk_level'],
        'status_title': p2['status_title'],
        'result_message': p2['message']
    }
    s2 = req(f'{BASE}/results/save', 'POST', save_payload_2)
    print('Save 2 Response:', s2)
    priya_id = s2['result_id']

    print('\n=== 5. RETRIEVE HISTORY (NEWEST FIRST) ===')
    hist = req(f'{BASE}/results/history/{visitor_id}')
    print(f'Total records for {visitor_id}:', len(hist))
    for idx, r in enumerate(hist):
        print(f"  [{idx+1}] ID={r['id']}, Name={r['name']}, Score={r['mental_health_score']}, Risk={r['risk_level']}, Created={r['created_at']}")
    assert hist[0]['name'] == 'Priya', 'Expected newest record (Priya) first'
    assert hist[1]['name'] == 'Aniket', 'Expected older record (Aniket) second'

    print('\n=== 6. RETRIEVE SINGLE RESULT (OWNERSHIP VERIFICATION) ===')
    detail = req(f'{BASE}/results/{aniket_id}?visitor_id={visitor_id}')
    print('Detail for Aniket:', detail['name'], 'Score:', detail['mental_health_score'], 'Risk:', detail['risk_level'])

    print('\n=== 7. TEST UNAUTHORIZED GET (DIFFERENT VISITOR) ===')
    try:
        req(f'{BASE}/results/{aniket_id}?visitor_id=intruder-uuid')
        print('ERROR: Unauthorized access allowed!')
        sys.exit(1)
    except urllib.error.HTTPError as e:
        print(f'Correctly blocked: HTTP {e.code} {e.reason}')

    print('\n=== 8. DELETE ANIKET RESULT ===')
    d = req(f'{BASE}/results/{aniket_id}?visitor_id={visitor_id}', 'DELETE')
    print('Delete Response:', d)

    print('\n=== 9. VERIFY HISTORY AFTER DELETE ===')
    hist_after = req(f'{BASE}/results/history/{visitor_id}')
    print(f'Remaining records for {visitor_id}:', len(hist_after))
    assert len(hist_after) == 1, 'Expected 1 record remaining'
    assert hist_after[0]['id'] == priya_id, 'Expected only Priya remaining'
    print('Priya record intact. Aniket record successfully deleted.')

    print('\n=== 10. CLEAN UP PRIYA RESULT ===')
    d2 = req(f'{BASE}/results/{priya_id}?visitor_id={visitor_id}', 'DELETE')
    print('Delete Priya Response:', d2)

    hist_empty = req(f'{BASE}/results/history/{visitor_id}')
    print('Final history length:', len(hist_empty))
    assert len(hist_empty) == 0

    print('\nALL DATABASE, SAVE, HISTORY, AND DELETE TESTS PASSED PERFECTLY!')

if __name__ == '__main__':
    main()
