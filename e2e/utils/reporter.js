const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class Reporter {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        this.skipped = 0;
    }

    addResult(testName, status, duration, error = null) {
        this.results.push({ testName, status, duration, error });
        if (status === 'passed') this.passed++;
        if (status === 'failed') this.failed++;
        if (status === 'skipped' || status === 'pending') this.skipped++;
    }

    log(message) {
        const logsDir = path.join(__dirname, '..', 'Test Results', 'Logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        const logFile = path.join(logsDir, 'execution.log');
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
        console.log(`[LOG] ${message}`);
    }

    async generateReports() {
        const baseDir = path.join(__dirname, '..', 'Test Results');
        const excelDir = path.join(baseDir, 'Excel');
        const summaryDir = path.join(baseDir, 'Summary');
        
        [excelDir, summaryDir].forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });

        // Generate Excel
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Test Execution');
        sheet.columns = [
            { header: 'Test Name', key: 'testName', width: 40 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Duration (ms)', key: 'duration', width: 15 },
            { header: 'Error', key: 'error', width: 50 },
        ];
        
        this.results.forEach(res => sheet.addRow(res));
        await workbook.xlsx.writeFile(path.join(excelDir, 'Automation_Test_Report.xlsx'));

        // Generate Markdown Summary
        const total = this.results.length;
        const passPercentage = total > 0 ? ((this.passed / total) * 100).toFixed(2) : 0;
        
        const failedTestsContent = this.results
            .filter(r => r.status === 'failed')
            .map(r => `- ${r.testName}\n  - Failure Reason: ${r.error}`)
            .join('\n');

        const baseUrl = process.env.BASE_URL || 'Unknown URL';
        
        const summary = `
# Live GitHub Pages E2E Test Summary

Deployment URL:
${baseUrl}

Total Tests: ${total}
Passed: ${this.passed}
Failed: ${this.failed}
Skipped: ${this.skipped}
Pass Percentage: ${passPercentage}%

Failed Tests:
${failedTestsContent || 'None'}
`;
        fs.writeFileSync(path.join(summaryDir, 'summary.md'), summary.trim() + '\n');
    }
}

module.exports = new Reporter();
