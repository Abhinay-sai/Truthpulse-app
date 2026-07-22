const fs = require('fs');
const path = require('path');
const autocannon = require('autocannon');
const ExcelJS = require('exceljs');

const targetUrl = process.argv[2] || 'http://localhost:5000/health';
const vuCount = Number(process.argv[3] || 100);
const durationSeconds = Number(process.argv[4] || 60);
const reportDir = path.join(__dirname, 'reports');
const reportPath = path.join(reportDir, 'baseline-load-test.xlsx');

function ensureReportDir() {
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }
}

async function writeExcelReport(result) {
    ensureReportDir();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('baseline_load_test');

    worksheet.columns = [
        { header: 'Metric', key: 'metric', width: 28 },
        { header: 'Value', key: 'value', width: 24 },
    ];

    const rows = [
        ['Target URL', targetUrl],
        ['Virtual Users', vuCount],
        ['Duration (seconds)', durationSeconds],
        ['Total Requests', result.requests.total],
        ['Requests per Second', `${Number(result.requests.average).toFixed(2)} req/sec`],
        ['Average Response Time', `${Number(result.latency.average).toFixed(2)} ms`],
        ['Min Response Time', `${Number(result.latency.min).toFixed(2)} ms`],
        ['Max Response Time', `${Number(result.latency.max).toFixed(2)} ms`],
        ['P95 Response Time', `${Number(result.latency.p95 || 0).toFixed(2)} ms`],
        ['Errors/Timeouts', result.errors || 0],
        ['Started At', new Date().toISOString()],
    ];

    rows.forEach(([metric, value]) => {
        worksheet.addRow({ metric, value });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getColumn('A').alignment = { vertical: 'middle' };
    worksheet.getColumn('B').alignment = { vertical: 'middle' };

    await workbook.xlsx.writeFile(reportPath);
    console.log(`Excel report saved to ${reportPath}`);
}

console.log(`Starting baseline load test...`);
console.log(`Target: ${targetUrl}`);
console.log(`Virtual Users (connections): ${vuCount}`);
console.log(`Duration: ${durationSeconds} seconds\n`);

const instance = autocannon({
    url: targetUrl,
    connections: vuCount,
    duration: durationSeconds,
    headers: {
        'Accept': 'application/json',
    },
}, async (err, result) => {
    if (err) {
        console.error('Error running load test:', err);
        process.exit(1);
        return;
    }

    await writeExcelReport(result);

    console.log('\n========================================');
    console.log('LOAD TEST RESULTS SUMMARY');
    console.log('========================================\n');

    console.log('What you will see');
    console.log('----------------------------------------');
    console.log('Requests per second (RPS)');
    console.log(`Average: ${Math.round(result.requests.average)} req/sec`);
    console.log(`Meaning your API is handling about ${Math.round(result.requests.average)} requests every second.\n`);

    console.log('Response Time');
    console.log(`Average: ${result.latency.average.toFixed(2)}ms`);
    console.log(`Min: ${result.latency.min.toFixed(2)}ms`);
    console.log(`Max: ${result.latency.max.toFixed(2)}ms`);
    console.log(`P95: ${Number(result.latency.p95 || 0).toFixed(2)}ms`);

    console.log('\nMeaning:');
    console.log(`• Fastest response = ${result.latency.min.toFixed(2)}ms`);
    console.log(`• Average = ${result.latency.average.toFixed(2)}ms`);
    console.log(`• Slowest = ${result.latency.max.toFixed(2)}ms`);
    console.log(`• Total Requests Sent = ${result.requests.total}`);
    console.log(`• Errors/Timeouts = ${result.errors || 0}`);
    console.log('\n========================================');
});

process.once('SIGINT', () => {
    instance.stop();
});

autocannon.track(instance, { renderProgressBar: false });
