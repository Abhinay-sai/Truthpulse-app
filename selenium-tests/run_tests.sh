#!/bin/bash

# Bash script to execute Selenium Web E2E testing suite

echo -e "\033[1;36m==========================================\033[0m"
echo -e "\033[1;36m      Starting Selenium E2E Web Suite     \033[0m"
echo -e "\033[1;36m==========================================\033[0m"

# Create directories
mkdir -p reports screenshots

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo -e "\033[1;33mInstalling NPM dependencies...\033[0m"
    npm install
fi

# Run mocha E2E tests
echo -e "\033[1;33mRunning Mocha E2E test cases...\033[0m"
npm test

# Done
echo -e "\033[1;32mExecution completed. Reports are stored in reports/ folder.\033[0m"
