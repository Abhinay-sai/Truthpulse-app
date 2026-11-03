#!/bin/bash

# Bash script to execute Appium E2E testing suite

echo -e "\033[1;36m==========================================\033[0m"
echo -e "\033[1;36m      Starting Appium E2E Test Suite      \033[0m"
echo -e "\033[1;36m==========================================\033[0m"

# Create directories
mkdir -p reports screenshots

# Create virtual environment if missing
if [ ! -d "venv" ]; then
    echo -e "\033[1;33mCreating Python virtual environment...\033[0m"
    python3 -m venv venv
fi

# Activate and install dependencies
echo -e "\033[1;33mActivating virtual environment & checking dependencies...\033[0m"
source venv/bin/activate
pip install -r requirements.txt --quiet

# Verify Appium server is running
echo -e "\033[1;33mVerifying Appium Server status...\033[0m"
curl -s -m 3 http://127.0.0.1:4723/status > /dev/null
if [ $? -eq 0 ]; then
    echo -e "\033[1;32mAppium server is UP.\033[0m"
else
    echo -e "\033[1;31mWarning: Appium server is not responding at http://127.0.0.1:4723/status\033[0m"
    echo -e "\033[1;33mPlease ensure you have started Appium with command: appium\033[0m"
fi

# Run pytest tests
echo -e "\033[1;33mRunning pytest E2E test suite...\033[0m"
python3 -m pytest tests/ -v --html=reports/report.html --self-contained-html

# Done
echo -e "\033[1;32mExecution completed. Reports are stored in reports/ folder.\033[0m"
