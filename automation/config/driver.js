const { remote } = require('webdriverio');

async function buildDriver() {
    const capabilities = {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        // GitHub Actions build output path
        'appium:app': process.env.APK_PATH || '../build/app/outputs/flutter-apk/app-debug.apk',
        'appium:newCommandTimeout': 240,
        'appium:noReset': false,
        'appium:fullReset': true,
        // Capabilities to speed up execution
        'appium:disableWindowAnimation': true,
        'appium:skipUnlock': true
    };

    const driver = await remote({
        protocol: 'http',
        hostname: '127.0.0.1',
        port: 4723,
        path: '/', 
        capabilities,
        logLevel: 'error'
    });

    return driver;
}

module.exports = { buildDriver };
