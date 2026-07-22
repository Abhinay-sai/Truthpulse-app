import json, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / 'input.json'


def load_input():
    with INPUT.open() as f:
        return json.load(f)


def request(url, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, headers=headers, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, resp.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', errors='replace')
    except Exception as e:
        return None, str(e)


if __name__ == '__main__':
    payload = load_input()
    base_url = payload.get('baseUrl', '').rstrip('/')
    token = payload.get('user')
    tampered = token.replace('user', 'admin') if token else 'tampered'
    status, body = request(f'{base_url}/auth/me', token=tampered)
    print('TOKEN TAMPERING PROBE')
    print('=====================')
    print(f'status={status}')
    print(body[:200])
