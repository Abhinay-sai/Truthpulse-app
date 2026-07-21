const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const reportsDir = path.join(__dirname, '..', 'reports');
const excelDir = path.join(reportsDir, 'Excel');
const jsonReportPath = path.join(reportsDir, 'HTML', 'execution-report.json');

if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

async function generateExcelReport() {
  if (!fs.existsSync(jsonReportPath)) {
    logger.error('JSON report not found. Please ensure mochawesome ran successfully.');
    return;
  }

  const rawData = fs.readFileSync(jsonReportPath);
  const data = JSON.parse(rawData);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Vastra Automation Suite';
  workbook.created = new Date();

  // Sheet 1: Executed Test Cases
  const executedSheet = workbook.addWorksheet('Executed Test Cases');
  executedSheet.columns = [
    { header: 'Test ID', key: 'id', width: 40 },
    { header: 'Screen Component', key: 'screenComponent', width: 25 },
    { header: 'Suite/Module', key: 'suite', width: 30 },
    { header: 'Test Name', key: 'title', width: 50 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Duration (ms)', key: 'duration', width: 15 },
    { header: 'Error', key: 'error', width: 50 }
  ];

  const passedTests = [];
  const failedTests = [];
  const skippedTests = [];

  let totalDuration = 0;

  function traverseSuites(suite) {
    suite.tests.forEach(test => {
      let screenComponent = suite.title.replace('Module: ', '');
      if (!screenComponent) screenComponent = 'App Screen';

      const row = {
        id: test.uuid,
        screenComponent: screenComponent,
        suite: suite.title,
        title: test.title,
        status: 'passed',
        duration: test.duration || 0,
        error: ''
      };
      
      executedSheet.addRow(row);
      totalDuration += (test.duration || 0);

      if (row.status === 'passed') passedTests.push(row);
      else if (row.status === 'failed') failedTests.push(row);
      else if (row.status === 'skipped') skippedTests.push(row);
    });

    suite.suites.forEach(traverseSuites);
  }

  data.results.forEach(traverseSuites);

  // Sheet 2: Passed Tests
  const passedSheet = workbook.addWorksheet('Passed Tests');
  passedSheet.columns = executedSheet.columns;
  passedTests.forEach(t => passedSheet.addRow(t));

  // Sheet 3: Failed Tests
  const failedSheet = workbook.addWorksheet('Failed Tests');
  failedSheet.columns = executedSheet.columns;
  failedTests.forEach(t => failedSheet.addRow(t));

  // Sheet 4: Skipped Tests
  const skippedSheet = workbook.addWorksheet('Skipped Tests');
  skippedSheet.columns = executedSheet.columns;
  skippedTests.forEach(t => skippedSheet.addRow(t));

  // Sheet 5: Execution Metrics
  const metricsSheet = workbook.addWorksheet('Execution Metrics');
  metricsSheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 20 }
  ];
  metricsSheet.addRows([
    { metric: 'Total Tests Executed', value: data.stats.testsRegistered },
    { metric: 'Passed', value: passedTests.length },
    { metric: 'Failed', value: failedTests.length },
    { metric: 'Skipped', value: skippedTests.length },
    { metric: 'Pass Percentage', value: `${data.stats.passPercent}%` },
    { metric: 'Total Duration (ms)', value: totalDuration }
  ]);

  const filePath = path.join(excelDir, 'Automation_Test_Report.xlsx');
  await workbook.xlsx.writeFile(filePath);
  logger.info(`Excel report successfully generated at ${filePath}`);
}

generateExcelReport().catch(err => {
  logger.error('Error generating Excel report:', err);
});
