const { createDriver } = require('./config');
const reporter = require('./utils/reporter');

let driver;

before(async function () {
    console.log('[Selenium] Starting test execution...');
    try {
        driver = await createDriver();
        global.driver = driver;
        console.log('[Selenium] WebDriver session established successfully.');
    } catch (error) {
        console.error('[Selenium] Failed to start driver session:', error);
        throw error;
    }
});

after(async function () {
    console.log('[Selenium] Test execution finished. Generating reports...');
    if (driver) {
        await driver.quit();
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
            const image = await global.driver.takeScreenshot();
            fs.writeFileSync(screenshotPath, image, 'base64');
            console.log(`[Selenium] Saved screenshot for failed test: ${screenshotPath}`);
        } catch (err) {
            console.error('[Selenium] Error saving screenshot:', err);
        }
    }
});
