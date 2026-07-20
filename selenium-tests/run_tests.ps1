# Windows PowerShell script to execute Selenium Web E2E testing suite

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      Starting Selenium E2E Web Suite     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Create directories
New-Item -ItemType Directory -Force -Path "reports" | Out-Null
New-Item -ItemType Directory -Force -Path "screenshots" | Out-Null

# Verify node modules are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing NPM dependencies..." -ForegroundColor Yellow
    npm install
}

# Run mocha E2E tests
Write-Host "Running Mocha E2E test cases..." -ForegroundColor Yellow
npm test

# Check test outcome
if ($LASTEXITCODE -eq 0) {
    Write-Host "All Web tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Some Web tests failed. Please review the reports." -ForegroundColor Red
}

# Open Excel report
$excel_reports = Get-ChildItem "reports/web_test_report_*.xlsx" | Sort-Object LastWriteTime -Descending
if ($excel_reports.Count -gt 0) {
    $latest_excel = $excel_reports[0].FullName
    Write-Host "Opening Excel Report: $latest_excel" -ForegroundColor Green
    Start-Process $latest_excel
} else {
    Write-Host "Excel report not found." -ForegroundColor Yellow
}
