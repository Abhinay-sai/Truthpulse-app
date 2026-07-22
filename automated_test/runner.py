import json, os, subprocess, sys, textwrap, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / 'input.json'
SAVEPOINT = ROOT / 'savepoint.json'
REPORT = ROOT / 'report.json'


def load_input():
    with INPUT.open() as f:
        return json.load(f)


def write_savepoint(data):
    SAVEPOINT.write_text(json.dumps(data, indent=2))


def load_savepoint():
    if SAVEPOINT.exists():
        return json.loads(SAVEPOINT.read_text())
    return {}


if __name__ == '__main__':
    payload = load_input()
    base_url = payload.get('baseUrl', '').rstrip('/')
    print(f'BASE_URL={base_url}')
    write_savepoint({'baseUrl': base_url, 'started': time.time()})
    print('Created savepoint and input context.')
    print('Use the per-category scripts under automated_test/ to execute the DAST flow.')
