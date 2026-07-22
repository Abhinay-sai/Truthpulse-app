import json, os, re, sys, subprocess, time
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / 'input.json'


def load_input():
    with INPUT.open() as f:
        return json.load(f)


def discover_from_code():
    backend_dir = Path(__file__).resolve().parents[1] / 'backend'
    index_file = backend_dir / 'index.js'
    text = index_file.read_text(encoding='utf-8')
    routes = []
    for match in re.finditer(r"app\.(get|post|put|patch|delete)\(\s*['\"]([^'\"]+)['\"]", text):
        method = match.group(1).upper()
        path = match.group(2)
        routes.append((method, path))
    return routes


if __name__ == '__main__':
    payload = load_input()
    base_url = payload.get('baseUrl', '').rstrip('/')
    routes = discover_from_code()
    print('DISCOVERED ENDPOINTS')
    print('====================')
    for method, path in routes:
        if path in {'/health', '/actuator', '/metrics'}:
            continue
        print(f'{method} {path}')
    print('====================')
    print(f'TOTAL_DISCOVERED={len(routes)}')
    print('PAUSE: review the list above before running probes.')
