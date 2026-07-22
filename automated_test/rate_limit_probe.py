import json, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / 'input.json'


def load_input():
    with INPUT.open() as f:
        return json.load(f)


def request(url):
    req = urllib.request.Request(url, headers={'Content-Type': 'application/json'}, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:
        return None


if __name__ == '__main__':
    payload = load_input()
    base_url = payload.get('baseUrl', '').rstrip('/')
    print('RATE LIMIT PROBE')
    print('================')
    statuses = []
    for i in range(35):
        statuses.append(request(f'{base_url}/health'))
        time.sleep(0.1)
    print(statuses)
