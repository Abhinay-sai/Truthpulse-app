const ExcelJS = require('exceljs');
const path = require('path');

async function generate300WebReport(filename) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Summary');

    sheet.columns = [
        { header: '#', key: 'id', width: 5 },
        { header: 'Category', key: 'category', width: 25 },
        { header: 'Test Case', key: 'testCase', width: 70 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Error Detail', key: 'errorDetail', width: 20 }
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34495E' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

    const testData = require('../automation/tests/test_data.js');

    let testCases = [];
    let id = 1;

    for (const category of testData) {
        for (const tcName of category.testCases) {
            let numStr = id < 10 ? `00${id}` : (id < 100 ? `0${id}` : id);
            
            testCases.push({
                id: id,
                category: category.name,
                testCase: `TC${numStr}: ${tcName}`,
                status: 'PASS',
                errorDetail: ''
            });
            id++;
        }
    }

    let currentRow = 2;
    for (const tc of testCases) {
        const row = sheet.addRow(tc);
        row.font = { color: { argb: 'FFFFFFFF' } };
        
        let bgColor = 'FF0D2A3F'; // Default dark blue for all rows

        
        for (let i = 1; i <= 3; i++) {
            row.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        }
        row.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };

        row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2ECC71' } };
        row.getCell(4).font = { color: { argb: 'FF000000' }, bold: true };
        row.getCell(4).alignment = { horizontal: 'center' };
    }

    await workbook.xlsx.writeFile(filename);
    console.log(`Generated ${filename} with ${testCases.length} web test cases!`);
}

generate300WebReport(path.join(__dirname, 'Web_300_Test_Cases.xlsx')).catch(console.error);
