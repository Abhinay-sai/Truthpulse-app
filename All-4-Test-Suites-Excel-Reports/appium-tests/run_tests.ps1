# Windows PowerShell script to execute Appium E2E testing suite

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      Starting Appium E2E Tests          " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Install dependencies if not exist
Write-Host "Installing dependencies..."
pip install -r requirements.txt

# Create an output directory for reports if it doesn't exist
if (-Not (Test-Path -Path ".\reports")) {
    New-Item -ItemType Directory -Path ".\reports"
}

# Run pytest to generate HTML and Excel report
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$htmlReportPath = ".\reports\appium_report_$timestamp.html"
Write-Host "Running tests..."
pytest tests/ --html=$htmlReportPath --self-contained-html

Write-Host "==========================================" -ForegroundColor Green
Write-Host "      Appium E2E Tests Completed         " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Reports have been generated in the reports/ folder."
