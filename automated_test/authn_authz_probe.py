import json, os, sys, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / 'input.json'


def load_input():
    with INPUT.open() as f:
        return json.load(f)


def request(url, method='GET', token=None, data=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    body = None
    if data is not None:
        body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='replace')
            return resp.status, time.time() - start, content
    except urllib.error.HTTPError as e:
        return e.code, time.time() - start, e.read().decode('utf-8', errors='replace')
    except Exception as e:
        return None, time.time() - start, str(e)


if __name__ == '__main__':
    payload = load_input()
    base_url = payload.get('baseUrl', '').rstrip('/')
    print('AUTHN/AUTHZ PROBE')
    print('=================')
    cases = [
        ('public', None),
        ('no-auth', None),
        ('malformed-token', 'bad.token'),
        ('expired-token', 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ0ZXN0In0.'),
    ]
    for label, token in cases:
        status, elapsed_ms, body = request(f'{base_url}/auth/me', method='GET', token=token)
        print(f'{label}: status={status} time={elapsed_ms*1000:.0f}ms body={body[:120]}')
