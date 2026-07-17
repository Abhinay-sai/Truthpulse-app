const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class Reporter {
    constructor() {
        this.results = [];
        this.logs = [];
    }

    addResult(result) {
        this.results.push(result);
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${message}`;
        this.logs.push(logLine);
        console.log(logLine);
    }

    async generateReports() {
        const baseDir = path.join(__dirname, '..', 'Test Results');
        const excelDir = path.join(baseDir, 'Excel');
        const htmlDir = path.join(baseDir, 'HTML');
        const jsonDir = path.join(baseDir, 'JSON');
        const logsDir = path.join(baseDir, 'Logs');
        const summaryDir = path.join(baseDir, 'Summary');
        
        [excelDir, htmlDir, jsonDir, logsDir, summaryDir].forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });

        fs.writeFileSync(path.join(logsDir, 'execution.log'), this.logs.join('\\n'));
        fs.writeFileSync(path.join(jsonDir, 'execution-results.json'), JSON.stringify(this.results, null, 2));

        // Generate the massive Excel Reports
        const workbook = new ExcelJS.Workbook();
        const passed = this.results.filter(r => r.status === 'passed');
        const failed = this.results.filter(r => r.status === 'failed');
        const skipped = this.results.filter(r => r.status === 'skipped');

        const createSheet = (name, data) => {
            const ws = workbook.addWorksheet(name);
            ws.columns = [
                { header: 'Test ID', key: 'testId', width: 20 },
                { header: 'Module', key: 'module', width: 20 },
                { header: 'Test Name', key: 'testName', width: 45 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Duration (ms)', key: 'duration', width: 15 },
                { header: 'Error', key: 'error', width: 60 },
            ];
            data.forEach(res => ws.addRow(res));
            return ws;
        };

        createSheet('Executed Test Cases', this.results);
        createSheet('Passed Tests', passed);
        createSheet('Failed Tests', failed);
        createSheet('Skipped Tests', skipped);

        const wsMetrics = workbook.addWorksheet('Execution Metrics');
        wsMetrics.addRow(['Total Tests', this.results.length]);
        wsMetrics.addRow(['Passed', passed.length]);
        wsMetrics.addRow(['Failed', failed.length]);
        wsMetrics.addRow(['Skipped', skipped.length]);
        const passRate = this.results.length > 0 ? ((passed.length / this.results.length) * 100).toFixed(2) : 0;
        wsMetrics.addRow(['Pass Rate', `${passRate}%`]);

        await workbook.xlsx.writeFile(path.join(excelDir, 'Automation_Test_Report.xlsx'));
        
        // We can also create a basic HTML Dashboard
        const html = `
        <html>
        <head><title>Selenium E2E Dashboard</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Live GitHub Pages E2E Execution Dashboard</h1>
            <h2>Total: ${this.results.length} | Passed: ${passed.length} | Failed: ${failed.length}</h2>
            <h3>Pass Rate: ${passRate}%</h3>
            <p>See Excel reports for detailed breakdowns.</p>
        </body>
        </html>
        `;
        fs.writeFileSync(path.join(htmlDir, 'dashboard.html'), html);
    }
}

module.exports = new Reporter();
