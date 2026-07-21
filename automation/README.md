# Enterprise Selenium Automation Framework (Phase 7)

## Overview
This framework provides a complete Page Object Model (POM) architecture containing 400+ exhaustive test cases covering Authentication, Navigation, Forms, Validation, CRUD, and Performance.

## Folder Structure
- `pages/` - Page Object Models for UI encapsulation
- `tests/` - Mocha test suites generating 400+ parameterized cases
- `utils/` - Reporter (Excel/HTML), Logger, and Summary generator
- `config/` - Environment settings (`BASE_URL`, `HEADLESS`)
- `reports/` - Generated HTML and Excel reports

## Local Execution Guide
1. Open terminal and navigate to the `automation` folder.
2. Install dependencies: `npm install`
3. Run tests locally against a specified URL:
   `BASE_URL=http://localhost:5173 npm test`
4. Generate the Excel summary report:
   `npm run report:generate`

## CI/CD Execution Guide
The pipeline is fully automated via `.github/workflows/deploy-and-test.yml`.
1. Push code to `main` branch.
2. The workflow will automatically:
   - Build the React Frontend.
   - Deploy to GitHub Pages (`actions/deploy-pages`).
   - Run this automation suite targeting the LIVE URL.
   - Upload Excel, HTML, and Screenshot artifacts to GitHub Actions.
   - Publish an Execution Summary on the Job Summary page.

## Troubleshooting
- **Tests Failing on "net::ERR_CONNECTION_REFUSED"**: Ensure the `BASE_URL` is correct and the application is actively running at that address.
- **Excel Report Not Generated**: Ensure `mochawesome` completed and generated the `reports/HTML/execution-report.json` file.
- **Artifacts Not Uploaded**: The workflow uses `if: always()` on the upload step. If it skips, check if the job was cancelled manually.
