const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, '..', 'Test Results', 'JSON', 'execution-results.json');
if (!fs.existsSync(resultsPath)) {
    console.log('No results found.');
    process.exit(0);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const total = results.length;
const passed = results.filter(r => r.status === 'passed').length;
const failed = results.filter(r => r.status === 'failed').length;
const skipped = results.filter(r => r.status === 'skipped').length;
const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : 0;

const failedList = results
    .filter(r => r.status === 'failed')
    .slice(0, 10) // Show up to 10 failures in summary
    .map(r => `✗ ${r.testId} - ${r.testName}\\n  Reason: ${r.error}`)
    .join('\\n\\n');

const summary = `
# Android Appium E2E Execution Summary

**Build Number:** ${process.env.GITHUB_RUN_NUMBER || 'Local'}
**Branch:** ${process.env.GITHUB_REF_NAME || 'local-branch'}

## Execution Metrics
- **Total Test Cases:** ${total}
- **Passed:** ${passed}
- **Failed:** ${failed}
- **Skipped/Blocked:** ${skipped}
- **Pass Percentage:** ${passRate}%

## Defect Summary (Top 10)
\`\`\`text
${failedList || 'No failures!'}
\`\`\`

## Reports
View the full interactive dashboard and Excel reports in the **Artifacts** section of this run, or on the live GitHub Pages deployment.
`;

console.log(summary.trim());
