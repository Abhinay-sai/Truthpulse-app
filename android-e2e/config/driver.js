const { remote } = require('webdriverio');

async function buildDriver() {
    const capabilities = {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        // The APK path is relative to the runner or defined in GH actions
        'appium:app': process.env.APK_PATH || './build/app/outputs/flutter-apk/app-debug.apk',
        'appium:newCommandTimeout': 240,
        'appium:noReset': false,
        'appium:fullReset': true,
    };

    const driver = await remote({
        protocol: 'http',
        hostname: '127.0.0.1',
        port: 4723,
        path: '/', // Appium 2+ default path
        capabilities
    });

    return driver;
}

module.exports = { buildDriver };
