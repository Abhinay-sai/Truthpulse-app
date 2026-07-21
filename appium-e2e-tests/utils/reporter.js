const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class Reporter {
    constructor() {
        this.results = [];
    }

    addResult(testName, status, duration, error = '') {
        this.results.push({
            testName,
            status: status ? status.toUpperCase() : 'UNKNOWN',
            duration,
            error
        });
    }

    async generateReports() {
        const filename = 'App_E2E_Test_Report.xlsx';
        const filepath = path.join(__dirname, '..', filename);
        
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('E2E Results');

        sheet.columns = [
            { header: 'ID', key: 'id', width: 5 },
            { header: 'Test Case', key: 'testName', width: 60 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Duration (ms)', key: 'duration', width: 15 },
            { header: 'Error Details', key: 'error', width: 40 }
        ];

        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34495E' } };
        
        let passed = 0;
        let failed = 0;

        this.results.forEach((res, idx) => {
            if (res.status === 'PASSED') passed++;
            else failed++;

            const row = sheet.addRow({
                id: idx + 1,
                testName: res.testName,
                status: res.status,
                duration: res.duration,
                error: res.error
            });

            const statusColor = res.status === 'PASSED' ? 'FF2ECC71' : 'FFE74C3C';
            row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusColor } };
            row.getCell(3).font = { bold: true };
        });

        await workbook.xlsx.writeFile(filepath);
        console.log(`\n=========================================`);
        console.log(`Appium E2E Report Generated: ${filename}`);
        console.log(`Total: ${this.results.length} | Passed: ${passed} | Failed: ${failed}`);
        console.log(`=========================================\n`);
    }
}

module.exports = new Reporter();
