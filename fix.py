with open('backend/index.js', 'r') as f:
    content = f.read()

content = content.replace('anomalies found.)\n" : "";', 'anomalies found.) " : "";')

with open('backend/index.js', 'w') as f:
    f.write(content)
