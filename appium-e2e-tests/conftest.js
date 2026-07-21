const { remote } = require('webdriverio');
const { driverConfig } = require('./config');
const reporter = require('./utils/reporter');

let driver;

before(async function () {
    console.log('[Appium] Starting test execution...');
    try {
        driver = await remote(driverConfig);
        global.driver = driver;
        console.log('[Appium] Session established successfully.');
    } catch (error) {
        console.error('[Appium] Failed to start driver session:', error);
        throw error;
    }
});

after(async function () {
    console.log('[Appium] Test execution finished. Generating reports...');
    if (driver) {
        await driver.deleteSession();
    }
    await reporter.generateReports();
});

afterEach(async function () {
    const testName = this.currentTest.title;
    const status = this.currentTest.state;
    const duration = this.currentTest.duration || 0;
    const error = this.currentTest.err ? this.currentTest.err.message : '';
    
    reporter.addResult(testName, status, duration, error);

    if (status === 'failed' && global.driver) {
        try {
            const fs = require('fs');
            const path = require('path');
            const screenshotDir = path.join(__dirname, 'screenshots');
            if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);
            
            const screenshotPath = path.join(screenshotDir, `failed_${testName.replace(/\\s+/g, '_')}.png`);
            await global.driver.saveScreenshot(screenshotPath);
            console.log(`[Appium] Saved screenshot for failed test: ${screenshotPath}`);
        } catch (err) {
            console.error('[Appium] Error saving screenshot:', err);
        }
    }
});
