const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class Reporter {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
    }

    addResult(testName, status, duration, error = null) {
        this.results.push({ testName, status, duration, error });
        if (status === 'passed') this.passed++;
        if (status === 'failed') this.failed++;
    }

    async generateReports() {
        const dir = path.join(__dirname, '..', 'Test Results');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

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
        await workbook.xlsx.writeFile(path.join(dir, 'Automation_Test_Report.xlsx'));

        // Generate Markdown Summary
        const summary = `
# E2E Test Execution Summary
**Total Tests:** ${this.results.length}
**Passed:** ✅ ${this.passed}
**Failed:** ❌ ${this.failed}

## Details
| Test Name | Status | Duration |
|-----------|--------|----------|
${this.results.map(r => `| ${r.testName} | ${r.status === 'passed' ? '✅ Pass' : '❌ Fail'} | ${r.duration}ms |`).join('\n')}
`;
        fs.writeFileSync(path.join(dir, 'summary.md'), summary.trim());
    }
}

module.exports = new Reporter();
