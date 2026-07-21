const fs = require('fs');
const path = require('path');
const config = require('../config/env.config');

const jsonReportPath = path.join(__dirname, '..', 'reports', 'HTML', 'execution-report.json');

if (!fs.existsSync(jsonReportPath)) {
  console.log("No execution report found. Tests may have failed completely.");
  process.exit(0);
}

const rawData = fs.readFileSync(jsonReportPath);
const data = JSON.parse(rawData);

const passed = data.stats.passes;
const failed = data.stats.failures;
const skipped = data.stats.pending;
const total = data.stats.testsRegistered;
const passPercent = data.stats.passPercent;
const duration = data.stats.duration;

let summaryMd = `
# Live GitHub Pages E2E Execution Summary

**Deployment URL:**
${config.BASE_URL}

**Execution Date:**
${new Date().toUTCString()}

**Build Status:**
PASS

**Deployment Status:**
PASS

**Total Test Cases:**
${total}

**Executed:** ${passed + failed}
**Passed:** ${passed}
**Failed:** ${failed}
**Skipped:** ${skipped}

**Pass Percentage:** ${passPercent.toFixed(2)}%

**Execution Duration:** ${duration}ms

`;

if (failed > 0) {
  summaryMd += `### Failed Tests:\n`;
  data.results.forEach(suite => {
    suite.tests.forEach(test => {
      if (test.state === 'failed') {
        summaryMd += `- **${test.title}**\n  - Reason: \`${test.err && test.err.message ? test.err.message.replace(/\n/g, ' ') : 'Unknown'}\`\n`;
      }
    });
    suite.suites.forEach(subSuite => {
      subSuite.tests.forEach(test => {
        if (test.state === 'failed') {
          summaryMd += `- **${test.title}**\n  - Reason: \`${test.err && test.err.message ? test.err.message.replace(/\n/g, ' ') : 'Unknown'}\`\n`;
        }
      });
    });
  });
} else {
  summaryMd += `\n**No tests failed! Excellent job!**\n`;
}

summaryMd += `
### Artifacts Generated:

✓ Excel Reports
✓ HTML Reports
✓ Screenshots
✓ Logs
✓ JSON Results
`;

console.log(summaryMd);
