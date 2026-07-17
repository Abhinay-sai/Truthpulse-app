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

        // 1. Save Logs
        fs.writeFileSync(path.join(logsDir, 'execution.log'), this.logs.join('\\n'));

        // 2. Save JSON
        fs.writeFileSync(path.join(jsonDir, 'execution-results.json'), JSON.stringify(this.results, null, 2));

        // 3. Generate Excel
        const workbook = new ExcelJS.Workbook();
        
        const passed = this.results.filter(r => r.status === 'passed');
        const failed = this.results.filter(r => r.status === 'failed');
        const skipped = this.results.filter(r => r.status === 'skipped');

        // Sheet 1: All Executed
        const wsAll = workbook.addWorksheet('Executed Test Cases');
        wsAll.columns = [
            { header: 'Test ID', key: 'testId', width: 20 },
            { header: 'Module', key: 'module', width: 20 },
            { header: 'Test Name', key: 'testName', width: 40 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Duration (ms)', key: 'duration', width: 15 },
            { header: 'Error', key: 'error', width: 50 },
        ];
        this.results.forEach(res => wsAll.addRow(res));

        // Sheet 2: Passed
        const wsPassed = workbook.addWorksheet('Passed Tests');
        wsPassed.columns = wsAll.columns;
        passed.forEach(res => wsPassed.addRow(res));

        // Sheet 3: Failed
        const wsFailed = workbook.addWorksheet('Failed Tests');
        wsFailed.columns = wsAll.columns;
        failed.forEach(res => wsFailed.addRow(res));

        // Sheet 4: Metrics
        const wsMetrics = workbook.addWorksheet('Execution Metrics');
        wsMetrics.addRow(['Total Tests', this.results.length]);
        wsMetrics.addRow(['Passed', passed.length]);
        wsMetrics.addRow(['Failed', failed.length]);
        wsMetrics.addRow(['Skipped', skipped.length]);
        wsMetrics.addRow(['Pass Rate', `${((passed.length / this.results.length) * 100).toFixed(2)}%`]);

        await workbook.xlsx.writeFile(path.join(excelDir, 'Automation_Test_Report.xlsx'));
    }
}

module.exports = new Reporter();
