const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/repos/Abhinay-sai/Truthpulse-app/actions/jobs/86040675588/logs',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js',
    'Accept': 'application/vnd.github.v3+json'
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    // Follow redirect
    https.get(res.headers.location, (redirectRes) => {
      let data = '';
      redirectRes.on('data', (chunk) => data += chunk);
      redirectRes.on('end', () => console.log(data.slice(-2000))); // print last 2000 chars of logs
    });
  } else {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => console.log(data.slice(-2000)));
  }
});

req.on('error', (e) => console.error(e));
req.end();
