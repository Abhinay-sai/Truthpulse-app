const autocannon = require('autocannon');

// Default target is a lightweight route or change this to the route you want to test
const targetUrl = process.argv[2] || 'http://localhost:5000/'; 

console.log(`Starting Load Test...`);
console.log(`Target: ${targetUrl}`);
console.log(`Virtual Users (Connections): 100`);
console.log(`Duration: 60 seconds\n`);

const instance = autocannon({
    url: targetUrl,
    connections: 100,
    duration: 60,
    // Uncomment and configure these if you need to test authenticated POST routes
    // method: 'POST',
    // body: JSON.stringify({ email: "test@example.com", password: "Password123!" }),
    // headers: {
    //     'Content-type': 'application/json',
    //     // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
    // }
}, (err, result) => {
    if (err) {
        console.error('Error running load test:', err);
        return;
    }
    
    // Formatting the output to match your requested summary
    console.log('\n========================================');
    console.log('LOAD TEST RESULTS SUMMARY');
    console.log('========================================\n');
    
    console.log('What you will see');
    console.log('----------------------------------------');
    console.log('Requests per second (RPS)');
    console.log(`Average: ${Math.round(result.requests.average)} req/sec`);
    console.log(`Meaning your API is handling about ${Math.round(result.requests.average)} requests every second.\n`);
    
    console.log('Response Time');
    console.log(`Average: ${result.latency.average}ms`);
    console.log(`Min: ${result.latency.min}ms`);
    console.log(`Max: ${result.latency.max}ms`);
    
    console.log('\nMeaning:');
    console.log(`• Fastest response = ${result.latency.min}ms`);
    console.log(`• Average = ${result.latency.average}ms`);
    console.log(`• Slowest = ${result.latency.max}ms`);
    console.log(`• Total Requests Sent = ${result.requests.total}`);
    console.log(`• Errors/Timeouts = ${result.errors}`);
    console.log('\n========================================');
});

// Used to kill the instance on CTRL-C
process.once('SIGINT', () => {
    instance.stop();
});

// Render progress bar in terminal
autocannon.track(instance, {renderProgressBar: false});
