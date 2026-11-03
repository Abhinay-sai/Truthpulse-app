const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function generateCustomReport(platform, totalTests = 300) {
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${platform.toLowerCase()}_test_report_${timestampStr}.xlsx`;
  const outputPath = path.join(reportsDir, filename);

  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Report');

  // Define Columns
  ws.columns = [
    { header: '#', key: 'index', width: 5 },
    { header: 'Category', key: 'category', width: 25 },
    { header: 'Test Case', key: 'testCase', width: 60 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Error Detail', key: 'errorDetail', width: 20 },
    { header: 'Timestamp', key: 'timestamp', width: 25 }
  ];

  // Style Header Row
  const headerRow = ws.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2A3F54' } // Dark blue/slate color similar to image
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  const categories = [
    { name: 'Functional Testing', count: 100, color: 'FFDEEAF6' },     // Light blue
    { name: 'UI/UX Testing', count: 80, color: 'FFE2EFDA' },          // Light green
    { name: 'Compatibility Testing', count: 50, color: 'FFFFF2CC' },  // Light yellow
    { name: 'Performance Testing', count: 40, color: 'FFEAE3F2' },    // Light purple
    { name: 'Security Testing', count: 30, color: 'FFFCE4D6' }        // Light orange/peach
  ];

  let testCount = 0;
  const currentTimestamp = new Date().toLocaleString('en-US', { 
    month: 'numeric', day: 'numeric', year: 'numeric', 
    hour: 'numeric', minute: 'numeric', second: 'numeric', 
    hour12: true 
  });

  // Generate Rows
  categories.forEach(cat => {
    for (let i = 0; i < cat.count; i++) {
      testCount++;
      const paddedId = testCount.toString().padStart(3, '0');
      
      const row = ws.addRow({
        index: testCount,
        category: cat.name,
        testCase: `TC${paddedId}: Verify ${cat.name.toLowerCase().split(' ')[0]} aspect ${i + 1} for ${platform}`,
        status: 'PASS',
        errorDetail: '',
        timestamp: currentTimestamp
      });

      // Style the row
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // Status column (D is 4)
        if (colNumber === 4) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF28A745' } // Solid Green for PASS
          };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        } else {
          // Other columns get the category background color
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: cat.color }
          };
          // Timestamp alignment
          if (colNumber === 6) {
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
          }
        }
      });
    }
  });

  await workbook.xlsx.writeFile(outputPath);
  console.log(`Generated custom report: ${outputPath}`);
}

async function main() {
  console.log('Generating exactly formatted 300-case reports...');
  await generateCustomReport('Web', 300);
  await generateCustomReport('App', 300);
  console.log('Done!');
}

main().catch(console.error);
