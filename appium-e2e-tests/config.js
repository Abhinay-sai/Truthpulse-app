const path = require('path');

const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator', // Or actual device name
    'appium:app': path.resolve(__dirname, '../build/app/outputs/flutter-apk/app-release.apk'),
    'appium:appWaitActivity': '*', // Wait for any activity
    'appium:noReset': false,
    'appium:newCommandTimeout': 240
};

const driverConfig = {
    path: '/',
    port: 4723,
    capabilities: capabilities,
    logLevel: 'error'
};

module.exports = { driverConfig };
