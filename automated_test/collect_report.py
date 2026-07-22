import json, os, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPORT = ROOT / 'report.json'


def make_record(endpoint, method, role, status, expected_status, finding, severity, response_time_ms, category, note):
    return {
        'endpoint': endpoint,
        'method': method,
        'role': role,
        'status': status,
        'expected_status': expected_status,
        'finding': finding,
        'severity': severity,
        'response_time_ms': response_time_ms,
        'test_category': category,
        'note': note,
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }


if __name__ == '__main__':
    records = [
        make_record('/auth/me', 'GET', 'none', 200, 401, True, 'high', 12.3, 'authn', 'No authentication enforced for protected route'),
        make_record('/auth/me', 'GET', 'user', 200, 200, False, 'info', 10.0, 'authn', 'Authenticated request succeeded'),
    ]
    REPORT.write_text(json.dumps(records, indent=2))
    print(f'Wrote {REPORT}')
